import {
    Service, Logger
} from "@cmmv/core";

import {
    Repository, MoreThan
} from "@cmmv/repository";

import {
    PostsPublicService
} from "../posts/posts.service";

import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Service('blog_images')
export class ImagesService {
    private readonly logger = new Logger("ImagesService");
    private readonly uploadsDir = process.env.UPLOADS_DIR || './uploads';
    private readonly tempDir = process.env.TEMP_DIR || './temp';

    constructor(private readonly postsService: PostsPublicService) {
        this.ensureDirectoryExists(this.uploadsDir);
        this.ensureDirectoryExists(this.tempDir);
    }

    private ensureDirectoryExists(dir: string) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    /**
     * Crop an image to specific coordinates
     * @param imageBuffer The image buffer
     * @param cropParams The crop parameters
     * @returns The cropped image buffer
     */
    async cropImage(imageBuffer: Buffer, cropParams: {
        left: number;
        top: number;
        width: number;
        height: number;
    }): Promise<Buffer> {
        try {
            const { left, top, width, height } = cropParams;
            //@ts-ignore
            return await sharp(imageBuffer)
                .extract({ left, top, width, height })
                .toBuffer();
        } catch (error) {
            this.logger.error(`Erro ao cortar imagem: ${error}`);
            throw new Error('Falha ao processar o corte da imagem');
        }
    }

    /**
     * Resize an image to specific dimensions
     * @param imageBuffer The image buffer
     * @param resizeParams The resize parameters
     * @returns The resized image buffer
     */
    async resizeImage(imageBuffer: Buffer, resizeParams: {
        width?: number;
        height?: number;
        fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
    }): Promise<Buffer> {
        try {
            //@ts-ignore
            return await sharp(imageBuffer)
                .resize(resizeParams)
                .toBuffer();
        } catch (error) {
            this.logger.error(`Erro ao redimensionar imagem: ${error}`);
            throw new Error('Falha ao redimensionar a imagem');
        }
    }

    /**
     * Erase an area of an image using inpainting
     * @param imageBuffer The image buffer
     * @param maskParams The mask parameters
     * @returns The erased image buffer
     */
    async eraseImageArea(
        imageBuffer: Buffer,
        maskParams: {
            left: number;
            top: number;
            width: number;
            height: number;
        }
    ): Promise<Buffer> {
        try {
            const fileName = `${uuidv4()}.png`;
            const tempFilePath = path.join(this.tempDir, fileName);
            const resultFilePath = path.join(this.tempDir, `result_${fileName}`);

            //@ts-ignore
            const imageInfo = await sharp(imageBuffer).metadata();
            const { width, height } = imageInfo;

            //@ts-ignore
            await sharp(imageBuffer).toFile(tempFilePath);

            const maskBuffer = Buffer.from(
                new Uint8Array(width * height).fill(255)
            );

            const { left, top, maskWidth, maskHeight } = {
                left: maskParams.left,
                top: maskParams.top,
                maskWidth: maskParams.width,
                maskHeight: maskParams.height
            };

            for (let y = top; y < top + maskHeight && y < height; y++) {
                for (let x = left; x < left + maskWidth && x < width; x++) {
                    const idx = y * width + x;
                    if (idx < maskBuffer.length) {
                        maskBuffer[idx] = 0;
                    }
                }
            }

            //@ts-ignore
            const blurredImageBuffer = await sharp(imageBuffer)
                .blur(20)
                .toBuffer();

            //@ts-ignore
            const maskImage = await sharp(maskBuffer, {
                raw: {
                    width: width,
                    height: height,
                    channels: 1
                }
            }).toBuffer();

            //@ts-ignore
            const processedBuffer = await sharp(imageBuffer)
                .composite([{
                    input: blurredImageBuffer,
                    blend: 'multiply',
                    raw: {
                        width: width,
                        height: height,
                        channels: 4
                    }
                }])
                .toBuffer();

            return processedBuffer;
        } catch (error) {
            this.logger.error(`Erro ao processar apagamento: ${error}`);
            throw new Error('Falha ao apagar área da imagem');
        }
    }

    /**
     * Process image edit operations
     * @param imageBuffer The image buffer
     * @param operations The edit operations
     * @returns The processed image buffer
     */
    async processImageEdit(
        imageBuffer: Buffer,
        operations: {
            crop?: { left: number; top: number; width: number; height: number; };
            resize?: { width?: number; height?: number; fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'; };
            erase?: { left: number; top: number; width: number; height: number; };
        }
    ): Promise<Buffer> {
        try {
            let processedBuffer = imageBuffer;

            if (operations.crop)
                processedBuffer = await this.cropImage(processedBuffer, operations.crop);

            if (operations.resize)
                processedBuffer = await this.resizeImage(processedBuffer, operations.resize);

            if (operations.erase)
                processedBuffer = await this.eraseImageArea(processedBuffer, operations.erase);

            return processedBuffer;
        } catch (error) {
            this.logger.error(`Erro ao processar edição de imagem: ${error}`);
            throw new Error('Falha ao processar as operações de edição de imagem');
        }
    }
}
