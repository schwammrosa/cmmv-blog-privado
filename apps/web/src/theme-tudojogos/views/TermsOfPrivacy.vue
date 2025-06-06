<template>
    <div class="w-full relative bg-[#0a0a1a]">
        <div class="lg:max-w-4xl md:max-w-3xl px-4 sm:px-6 mx-auto">
            <div class="bg-[#0a0a1a] rounded-lg px-4 sm:px-6 py-8 border border-[#303443] text-gray-100">
                <h1 class="text-3xl font-bold mb-6 text-white">Política de Privacidade</h1>
                
                <div class="mb-8">
                    <a href="#privacy" class="mr-4 text-[#00ccff] hover:text-[#4ade80]">Política de Privacidade</a>
                    <a href="#cookies" class="text-[#00ccff] hover:text-[#4ade80]">Política de Cookies</a>
                </div>

                <h2 id="privacy" class="text-2xl font-semibold mt-8 mb-4 text-white border-l-4 border-[#6600cc] pl-3">Política de Privacidade – Tudo Jogo</h2>
                <a id="privacy-policy" title="Política de Privacidade"></a>
                <p class="mb-4 text-gray-300"><strong>Última atualização em maio de 2025</strong></p>
                <p class="mb-4 text-gray-300">A sua privacidade é importante para nós. É política do Tudo Jogo respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site https://tudojogo.com.br, e em outros sites que operamos.</p>

                <p class="mb-4 text-gray-300">Coletamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemos isso por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será utilizado.</p>

                <p class="mb-4 text-gray-300">Armazenamos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Protegemos os dados armazenados com medidas comercialmente aceitáveis para evitar perdas, acessos não autorizados, divulgação ou modificações indevidas.</p>

                <p class="mb-4 text-gray-300">Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.</p>

                <p class="mb-4 text-gray-300">Nosso site pode conter links para sites externos que não são operados por nós. Não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade.</p>

                <p class="mb-4 text-gray-300">Você é livre para recusar a solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados.</p>

                <p class="mb-4 text-gray-300">O uso continuado do nosso site será considerado como aceitação das nossas práticas em relação à privacidade e informações pessoais. Se tiver dúvidas sobre como lidamos com dados dos usuários, entre em contato conosco.</p>

                <h2 id="cookies" class="text-2xl font-semibold mt-12 mb-4 text-white pt-8 border-t border-[#303443] border-l-4 border-l-[#6600cc] pl-3">Política de Cookies – Tudo Jogo</h2>
                <a id="cookies-policy" title="Cookies"></a>
                <p class="mb-4 text-gray-300"><strong>Última atualização em maio de 2025</strong></p>
                
                <h3 class="text-xl font-medium mt-6 mb-3 text-[#4ade80]">O que são cookies?</h3>
                <p class="mb-4 text-gray-300">Cookies são pequenos arquivos baixados no seu computador para melhorar a experiência de navegação. Esta seção explica quais informações eles coletam, como os usamos e por que às vezes precisamos armazenar esses cookies.</p>

                <h3 class="text-xl font-medium mt-6 mb-3 text-[#4ade80]">Como usamos os cookies?</h3>
                <p class="mb-4 text-gray-300">Utilizamos cookies por diversos motivos, como:</p>
                <ul class="mb-4 pl-5 list-disc text-gray-300">
                    <li class="mb-2">Lembrar sessões e preferências do usuário;</li>
                    <li class="mb-2">Melhorar a navegação;</li>
                    <li class="mb-2">Entender o comportamento dos visitantes no site;</li>
                    <li class="mb-2">Exibir anúncios relevantes.</li>
                </ul>

                <h3 class="text-xl font-medium mt-6 mb-3 text-[#4ade80]">Desativar cookies</h3>
                <p class="mb-4 text-gray-300">Você pode desativar os cookies nas configurações do seu navegador. No entanto, isso pode afetar a funcionalidade do site e alguns recursos podem não funcionar corretamente.</p>

                <h3 class="text-xl font-medium mt-6 mb-3 text-[#4ade80]">Cookies que definimos</h3>
                <ul class="mb-4 pl-5 list-disc text-gray-300">
                    <li class="mb-2">Cookies de conta: usados durante o registro e login.</li>
                    <li class="mb-2">Cookies de login: mantêm você conectado enquanto navega.</li>
                    <li class="mb-2">Cookies de preferências: armazenam configurações personalizadas do site.</li>
                    <li class="mb-2">Cookies de formulários: lembram informações inseridas em formulários.</li>
                </ul>

                <h3 class="text-xl font-medium mt-6 mb-3 text-[#4ade80]">Cookies de Terceiros</h3>
                <p class="mb-4 text-gray-300">Usamos cookies de terceiros confiáveis, como:</p>
                <ul class="mb-4 pl-5 list-disc text-gray-300">
                    <li class="mb-2">Google Analytics: para entender como os usuários interagem com o site;</li>
                    <li class="mb-2">Google AdSense: para exibir anúncios relevantes;</li>
                    <li class="mb-2">Disqus: sistema de comentários;</li>
                    <li class="mb-2">Cookies de afiliados: para rastrear cliques e comissões.</li>
                </ul>

                <h3 class="text-xl font-medium mt-6 mb-3 text-[#4ade80]">Mais informações</h3>
                <p class="mb-4 text-gray-300">Se você tiver dúvidas sobre esta política de privacidade ou sobre como tratamos seus dados, entre em contato conosco pelo formulário disponível em <a href="/contato" class="text-[#00ccff] hover:text-[#4ade80]">https://tudojogo.com.br/contato</a>.</p>

                <p class="mb-4 text-gray-300">Esta política é válida a partir de maio de 2025.</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue';

useHead({
    title: 'Política de Privacidade',
    meta: [
        {
            name: 'description',
            content: 'Política de Privacidade e Cookies para Tudo Jogo'
        },
        {
            name: 'keywords',
            content: 'Tudo Jogo, Política de Privacidade, Cookies'
        }
    ]
})
</script>
