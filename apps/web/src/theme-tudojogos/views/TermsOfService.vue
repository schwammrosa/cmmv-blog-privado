<template>
    <div class="w-full relative bg-[#0a0a1a]">
        <div class="lg:max-w-4xl md:max-w-3xl px-4 sm:px-6 mx-auto">
            <div class="bg-[#0a0a1a] rounded-lg px-4 sm:px-6 py-8 border border-[#303443] text-gray-100">
                <h1 class="text-3xl font-bold mb-6 text-white">Termos de Uso</h1>
                <a id="terms-of-service" title="Termos de Uso"></a>
                <p class="mb-6 text-gray-300"><strong>Última atualização em maio de 2025</strong></p>

                <p class="mb-4 text-gray-300">Bem-vindo ao Tudo Jogo! Ao acessar nosso site https://tudojogo.com.br, você concorda com estes Termos de Uso. Leia atentamente antes de utilizar os serviços oferecidos.</p>
                
                <h2 class="text-2xl font-semibold mt-8 mb-4 text-white border-l-4 border-[#6600cc] pl-3">1. Aceitação dos Termos</h2>
                <a id="acceptance" title="Aceitação dos Termos"></a>
                <p class="mb-4 text-gray-300">Ao acessar ou utilizar o site Tudo Jogo, você concorda em cumprir e estar legalmente vinculado a estes termos, bem como à nossa Política de Privacidade. Se você não concorda com algum dos termos, não utilize o site.</p>

                <h2 class="text-2xl font-semibold mt-8 mb-4 text-white border-l-4 border-[#6600cc] pl-3">2. Uso do Conteúdo</h2>
                <a id="content-usage" title="Uso do Conteúdo"></a>
                <p class="mb-4 text-gray-300">Todo o conteúdo publicado no Tudo Jogo é apenas para fins informativos, educacionais e de entretenimento. Você pode:</p>
                <ul class="mb-4 pl-5 list-disc text-gray-300">
                    <li class="mb-2">Ler, compartilhar e comentar nossos artigos;</li>
                    <li class="mb-2">Utilizar informações para fins pessoais e não comerciais, desde que cite a fonte.</li>
                </ul>
                <p class="mb-4 text-gray-300">É proibida a reprodução total ou parcial do conteúdo para fins comerciais, sem autorização prévia por escrito.</p>

                <h2 class="text-2xl font-semibold mt-8 mb-4 text-white border-l-4 border-[#6600cc] pl-3">3. Propriedade Intelectual</h2>
                <a id="intellectual-property" title="Propriedade Intelectual"></a>
                <p class="mb-4 text-gray-300">Todos os textos, imagens, vídeos, logotipos e demais elementos visuais são de propriedade do Tudo Jogo ou licenciados por terceiros. O uso indevido de qualquer material poderá resultar em responsabilização civil e/ou criminal.</p>
                
                <h2 class="text-2xl font-semibold mt-8 mb-4 text-white border-l-4 border-[#6600cc] pl-3">4. Comentários e Interações</h2>
                <a id="comments" title="Comentários e Interações"></a>
                <p class="mb-4 text-gray-300">Usuários podem interagir com o site por meio de comentários, fóruns ou formulários. Ao participar, você se compromete a:</p>
                <ul class="mb-4 pl-5 list-disc text-gray-300">
                    <li class="mb-2">Não publicar conteúdo ofensivo, ilegal ou que infrinja direitos de terceiros;</li>
                    <li class="mb-2">Não utilizar linguagem de ódio, discriminação, ameaças ou assédio;</li>
                    <li class="mb-2">Ser responsável por suas opiniões e interações.</li>
                </ul>
                <p class="mb-4 text-gray-300">O Tudo Jogo se reserva o direito de moderar, remover ou bloquear qualquer conteúdo considerado inadequado, sem aviso prévio.</p>

                <h2 class="text-2xl font-semibold mt-8 mb-4 text-white border-l-4 border-[#6600cc] pl-3">5. Links Externos</h2>
                <a id="external-links" title="Links Externos"></a>
                <p class="mb-4 text-gray-300">Nosso site pode conter links para sites de terceiros. Não somos responsáveis pelo conteúdo, políticas ou práticas de sites externos. Recomendamos que você leia os termos de uso e políticas de privacidade desses sites.</p>

                <h2 class="text-2xl font-semibold mt-8 mb-4 text-white border-l-4 border-[#6600cc] pl-3">6. Modificações no Site</h2>
                <a id="site-modifications" title="Modificações no Site"></a>
                <p class="mb-4 text-gray-300">O Tudo Jogo pode, a qualquer momento e sem aviso prévio, alterar ou encerrar funcionalidades, conteúdos ou seções do site.</p>

                <h2 class="text-2xl font-semibold mt-8 mb-4 text-white border-l-4 border-[#6600cc] pl-3">7. Isenção de Responsabilidade</h2>
                <a id="disclaimer" title="Isenção de Responsabilidade"></a>
                <p class="mb-4 text-gray-300">Embora nos esforcemos para fornecer informações atualizadas e corretas, o Tudo Jogo não garante a exatidão, integridade ou atualidade dos conteúdos. O uso das informações é de responsabilidade exclusiva do usuário.</p>

                <h2 class="text-2xl font-semibold mt-8 mb-4 text-white border-l-4 border-[#6600cc] pl-3">8. Alterações nos Termos</h2>
                <a id="terms-changes" title="Alterações nos Termos"></a>
                <p class="mb-4 text-gray-300">Reservamo-nos o direito de alterar estes Termos de Uso a qualquer momento. Recomendamos que você os revise periodicamente. O uso contínuo do site após a publicação de mudanças será considerado aceitação das alterações.</p>

                <h2 class="text-2xl font-semibold mt-8 mb-4 text-white border-l-4 border-[#6600cc] pl-3">9. Contato</h2>
                <a id="contact" title="Contato"></a>
                <p class="mb-4 text-gray-300">Para dúvidas, sugestões ou solicitações relacionadas a estes termos, entre em contato conosco pelo formulário disponível em: <a href="/contato" class="text-[#00ccff] hover:text-[#4ade80]">https://tudojogo.com.br/contato</a></p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue';

useHead({
    title: 'Termos de Serviço',
    meta: [
        {
            name: 'description',
            content: 'Termos de Serviço para Tudo Jogo'
        },
        {
            name: 'keywords',
            content: 'Tudo Jogo, Termos de Serviço, CMMV'
        }
    ]
})
</script>
