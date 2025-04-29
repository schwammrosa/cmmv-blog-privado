import {
    Controller, Get, Post, Put, Delete, RouterSchema,
    Queries, Req, Param, Body, Res,
    CacheControl, ContentType, Raw
} from "@cmmv/http";

import {
    Auth
} from "@cmmv/auth";

import {
    ImagesService
} from "./images.service";

const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
];

@Controller("blog/images")
export class ImagesController {
    constructor(private readonly imagesService: ImagesService){}

    /**
     * Processa uma imagem com operações de edição
     * @param body Imagem em base64 e operações a serem realizadas
     * @param res Response
     */
    @Post('process')
    @Auth({ rootOnly: true })
    async processImage(
        @Body() body: {
            imageBase64: string;
            operations: {
                crop?: { left: number; top: number; width: number; height: number; };
                resize?: { width?: number; height?: number; fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'; };
                erase?: { left: number; top: number; width: number; height: number; };
            }
        },
        @Res() res: any
    ) {
        try {
            if (!body.imageBase64) {
                return res.status(400).json({
                    success: false,
                    message: 'Nenhuma imagem foi enviada'
                });
            }

            // Converter Base64 para Buffer
            const imageBuffer = this.base64ToBuffer(body.imageBase64);
            const mimeType = this.getMimeTypeFromBase64(body.imageBase64);

            const operations = body.operations || {};

            const processedBuffer = await this.imagesService.processImageEdit(
                imageBuffer,
                operations
            );

            // Converter para base64 para retornar na resposta
            const base64Image = processedBuffer.toString('base64');

            return {
                success: true,
                processedImage: `data:${mimeType};base64,${base64Image}`
            };
        } catch (error: any) {
            console.error('Erro ao processar imagem:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Falha ao processar a imagem'
            });
        }
    }

    /**
     * Endpoint específico para apagar áreas de uma imagem
     * @param body Imagem em base64 e parâmetros da área a ser apagada
     * @param res Response
     */
    @Post('erase')
    @Auth({ rootOnly: true })
    async eraseImageArea(
        @Body() body: {
            imageBase64: string;
            left: number;
            top: number;
            width: number;
            height: number;
        },
        @Res() res: any
    ) {
        try {
            if (!body.imageBase64) {
                return res.status(400).json({
                    success: false,
                    message: 'Nenhuma imagem foi enviada'
                });
            }

            // Converter Base64 para Buffer
            const imageBuffer = this.base64ToBuffer(body.imageBase64);
            const mimeType = this.getMimeTypeFromBase64(body.imageBase64);

            const maskParams = {
                left: body.left || 0,
                top: body.top || 0,
                width: body.width || 100,
                height: body.height || 100
            };

            const processedBuffer = await this.imagesService.eraseImageArea(
                imageBuffer,
                maskParams
            );

            // Converter para base64 para retornar na resposta
            const base64Image = processedBuffer.toString('base64');

            return {
                success: true,
                processedImage: `data:${mimeType};base64,${base64Image}`
            };
        } catch (error: any) {
            console.error('Erro ao apagar área da imagem:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Falha ao apagar área da imagem'
            });
        }
    }

    /**
     * Endpoint para crop de imagem
     * @param body Imagem em base64 e parâmetros do recorte
     * @param res Response
     */
    @Post('crop')
    @Auth({ rootOnly: true })
    async cropImage(
        @Body() body: {
            imageBase64: string;
            left: number;
            top: number;
            width: number;
            height: number;
        },
        @Res() res: any
    ) {
        try {
            if (!body.imageBase64) {
                return res.status(400).json({
                    success: false,
                    message: 'Nenhuma imagem foi enviada'
                });
            }

            // Converter Base64 para Buffer
            const imageBuffer = this.base64ToBuffer(body.imageBase64);
            const mimeType = this.getMimeTypeFromBase64(body.imageBase64);

            const cropParams = {
                left: body.left || 0,
                top: body.top || 0,
                width: body.width || 100,
                height: body.height || 100
            };

            const processedBuffer = await this.imagesService.cropImage(
                imageBuffer,
                cropParams
            );

            // Converter para base64 para retornar na resposta
            const base64Image = processedBuffer.toString('base64');

            return {
                success: true,
                processedImage: `data:${mimeType};base64,${base64Image}`
            };
        } catch (error: any) {
            console.error('Erro ao cortar imagem:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Falha ao cortar a imagem'
            });
        }
    }

    /**
     * Endpoint para redimensionar imagem
     * @param body Imagem em base64 e parâmetros de redimensionamento
     * @param res Response
     */
    @Post('resize')
    @Auth({ rootOnly: true })
    async resizeImage(
        @Body() body: {
            imageBase64: string;
            width?: number;
            height?: number;
            fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
        },
        @Res() res: any
    ) {
        try {
            if (!body.imageBase64) {
                return res.status(400).json({
                    success: false,
                    message: 'Nenhuma imagem foi enviada'
                });
            }

            // Converter Base64 para Buffer
            const imageBuffer = this.base64ToBuffer(body.imageBase64);
            const mimeType = this.getMimeTypeFromBase64(body.imageBase64);

            const resizeParams = {
                width: body.width,
                height: body.height,
                fit: body.fit || 'cover'
            };

            const processedBuffer = await this.imagesService.resizeImage(
                imageBuffer,
                resizeParams
            );

            // Converter para base64 para retornar na resposta
            const base64Image = processedBuffer.toString('base64');

            return {
                success: true,
                processedImage: `data:${mimeType};base64,${base64Image}`
            };
        } catch (error: any) {
            console.error('Erro ao redimensionar imagem:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Falha ao redimensionar a imagem'
            });
        }
    }

    /**
     * Converte uma string base64 para Buffer
     * @param base64String String base64 da imagem, pode incluir o prefixo data:image/...
     * @returns Buffer com os dados binários da imagem
     */
    private base64ToBuffer(base64String: string): Buffer {
        // Remover prefixo "data:image/..." se presente
        const base64Data = base64String.includes(';base64,')
            ? base64String.split(';base64,')[1]
            : base64String;

        return Buffer.from(base64Data, 'base64');
    }

    /**
     * Extrai o tipo MIME de uma string base64
     * @param base64String String base64 da imagem com prefixo data:image/...
     * @returns Tipo MIME da imagem
     */
    private getMimeTypeFromBase64(base64String: string): string {
        if (base64String.includes('data:') && base64String.includes(';base64,')) {
            return base64String.split(';base64,')[0].split(':')[1];
        }
        return 'image/jpeg'; // Default fallback
    }
}
