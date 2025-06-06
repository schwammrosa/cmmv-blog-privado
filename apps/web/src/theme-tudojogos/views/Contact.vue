<template>
    <div class="w-full relative bg-[#0a0a1a]">
        <div class="lg:max-w-4xl md:max-w-3xl px-4 sm:px-6 mx-auto py-8">
            <div class="bg-[#0a0a1a] rounded-lg px-4 sm:px-6 py-8 border border-[#303443] shadow-lg shadow-[#303443]/20">
                <h1 class="text-3xl font-bold mb-6 text-white border-l-4 border-[#6600cc] pl-4">Fale Conosco</h1>
                <p class="mb-6 text-gray-300">Tem alguma dúvida, sugestão, correção ou proposta de parceria? Entre em contato conosco! Será um prazer ouvir você.</p>

                <h2 id="form" class="text-2xl font-semibold mt-8 mb-4 text-white">📬 Formulário de Contato</h2>
                <p class="mb-6 text-gray-300">Preencha os campos abaixo e retornaremos o mais breve possível:</p>

                <form action="mailto:schwamm@hotmail.com.br" method="POST" enctype="text/plain" class="mb-8 bg-[#101028] p-5 rounded-lg border border-[#303443]">
                    <div class="mb-4">
                        <label for="name" class="block text-gray-300 mb-2">Nome:</label>
                        <input type="text" id="name" name="Nome" required class="w-full px-3 py-2 bg-[#0a0a1a] text-white border border-[#303443] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6600cc] focus:border-[#6600cc] transition-colors">
                    </div>

                    <div class="mb-4">
                        <label for="email" class="block text-gray-300 mb-2">E-mail:</label>
                        <input type="email" id="email" name="Email" required class="w-full px-3 py-2 bg-[#0a0a1a] text-white border border-[#303443] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6600cc] focus:border-[#6600cc] transition-colors">
                    </div>

                    <div class="mb-4">
                        <label for="subject" class="block text-gray-300 mb-2">Assunto:</label>
                        <input type="text" id="subject" name="Assunto" required class="w-full px-3 py-2 bg-[#0a0a1a] text-white border border-[#303443] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6600cc] focus:border-[#6600cc] transition-colors">
                    </div>

                    <div class="mb-4">
                        <label for="message" class="block text-gray-300 mb-2">Mensagem:</label>
                        <textarea id="message" name="Mensagem" rows="6" required class="w-full px-3 py-2 bg-[#0a0a1a] text-white border border-[#303443] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6600cc] focus:border-[#6600cc] transition-colors"></textarea>
                    </div>

                    <button type="submit" class="bg-[#6600cc] hover:bg-[#8833dd] text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6600cc]/50 transition-colors transform hover:-translate-y-0.5 duration-200 shadow-lg shadow-[#6600cc]/20">
                        Enviar
                    </button>
                </form>

                <h2 id="info" class="text-2xl font-semibold mt-12 mb-4 text-white pt-8 border-t border-[#303443] flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#00ccff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Informações de Contato
                </h2>
                <ul class="mb-8 text-gray-300 bg-[#101028] p-5 rounded-lg border border-[#303443] space-y-3">
                    <li class="flex items-center"><span class="font-bold text-white mr-2 min-w-[100px]">Nome:</span> Robson Schwamm Rosa</li>
                    <li class="flex items-center"><span class="font-bold text-white mr-2 min-w-[100px]">E-mail:</span> <a href="mailto:schwamm@hotmail.com.br" class="text-[#00ccff] hover:text-[#4ade80] transition-colors">schwamm@hotmail.com.br</a></li>
                    <li class="flex items-center"><span class="font-bold text-white mr-2 min-w-[100px]">Telefone/WhatsApp:</span> <a href="tel:+5562996962626" class="text-[#00ccff] hover:text-[#4ade80] transition-colors">(62) 9 9696-2626</a></li>
                    <li class="flex items-center"><span class="font-bold text-white mr-2 min-w-[100px]">Localização:</span> Brasil</li>
                    <li class="flex items-center"><span class="font-bold text-white mr-2 min-w-[100px]">Site:</span> <a href="https://tudojogo.com.br" target="_blank" class="text-[#00ccff] hover:text-[#4ade80] transition-colors">https://tudojogo.com.br</a></li>
                </ul>

                <h2 id="partnerships" class="text-2xl font-semibold mt-12 mb-4 text-white pt-8 border-t border-[#303443] flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#ffcc00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                    Parcerias e Imprensa
                </h2>
                <div class="mb-8 p-5 bg-[#101028] rounded-lg border border-[#303443] shadow-inner">
                    <p class="text-gray-300 mb-4">Se você representa uma empresa, desenvolvedora ou assessoria de imprensa e deseja divulgar jogos, produtos ou eventos, envie uma proposta diretamente por e-mail ou preencha o formulário.</p>
                    
                    <div class="flex items-center gap-2 text-[#ffcc00] font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd" />
                        </svg>
                        Estamos sempre abertos a novas parcerias!
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue';

useHead({
    title: 'Fale Conosco - Tudo Jogo',
    meta: [
        {
            name: 'description',
            content: 'Entre em contato com o Tudo Jogo para dúvidas, sugestões, correções ou propostas de parceria'
        },
        {
            name: 'keywords',
            content: 'Tudo Jogo, contato, fale conosco, suporte, parcerias'
        }
    ]
})
</script>
