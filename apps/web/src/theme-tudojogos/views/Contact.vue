<template>
    <div class="w-full relative">
        <div class="lg:max-w-4xl md:max-w-3xl px-4 sm:px-6 mx-auto">
            <div class="bg-white rounded-lg px-4 sm:px-6 py-8">
                <h1 class="text-3xl font-bold mb-6 text-neutral-900">Fale Conosco</h1>
                <p class="mb-6 text-neutral-700">Tem alguma dúvida, sugestão, correção ou proposta de parceria? Entre em contato conosco! Será um prazer ouvir você.</p>

                <h2 id="form" class="text-2xl font-semibold mt-8 mb-4 text-neutral-800">📬 Formulário de Contato</h2>
                <p class="mb-6 text-neutral-700">Preencha os campos abaixo e retornaremos o mais breve possível:</p>

                <form action="mailto:schwamm@hotmail.com.br" method="POST" enctype="text/plain" class="mb-8">
                    <div class="mb-4">
                        <label for="name" class="block text-neutral-700 mb-2">Nome:</label>
                        <input type="text" id="name" name="Nome" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>

                    <div class="mb-4">
                        <label for="email" class="block text-neutral-700 mb-2">E-mail:</label>
                        <input type="email" id="email" name="Email" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>

                    <div class="mb-4">
                        <label for="subject" class="block text-neutral-700 mb-2">Assunto:</label>
                        <input type="text" id="subject" name="Assunto" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>

                    <div class="mb-4">
                        <label for="message" class="block text-neutral-700 mb-2">Mensagem:</label>
                        <textarea id="message" name="Mensagem" rows="6" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>

                    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                        Enviar
                    </button>
                </form>

                <h2 id="info" class="text-2xl font-semibold mt-12 mb-4 text-neutral-800 pt-8 border-t border-gray-200">📞 Informações de Contato</h2>
                <ul class="mb-8 text-neutral-700">
                    <li class="mb-3"><strong>Nome:</strong> Robson Schwamm Rosa</li>
                    <li class="mb-3"><strong>E-mail:</strong> <a href="mailto:schwamm@hotmail.com.br" class="text-blue-600 hover:text-blue-800">schwamm@hotmail.com.br</a></li>
                    <li class="mb-3"><strong>Telefone/WhatsApp:</strong> <a href="tel:+5562996962626" class="text-blue-600 hover:text-blue-800">(62) 9 9696-2626</a></li>
                    <li class="mb-3"><strong>Localização:</strong> Brasil</li>
                    <li class="mb-3"><strong>Site:</strong> <a href="https://tudojogo.com.br" target="_blank" class="text-blue-600 hover:text-blue-800">https://tudojogo.com.br</a></li>
                </ul>

                <h2 id="partnerships" class="text-2xl font-semibold mt-12 mb-4 text-neutral-800 pt-8 border-t border-gray-200">📣 Parcerias e Imprensa</h2>
                <p class="mb-6 text-neutral-700">Se você representa uma empresa, desenvolvedora ou assessoria de imprensa e deseja divulgar jogos, produtos ou eventos, envie uma proposta diretamente por e-mail ou preencha o formulário.</p>
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
