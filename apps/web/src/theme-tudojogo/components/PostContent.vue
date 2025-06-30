<template>
    <div class="post-content text-gray-100 prose prose-sm sm:prose prose-invert prose-a:text-[#0a5d28] prose-a:hover:text-[#00cc44] max-w-none overflow-hidden">
        <div v-html="processedContent"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

const props = defineProps<{
    content: string;
}>();

const processedContent = ref('');
const isSSR = typeof window === 'undefined';

const processContent = (rawContent: string) => {
    if (!rawContent) return '';

    const twitterUrlPatterns = [
        /https?:\/\/(www\.)?twitter\.com\/([a-zA-Z0-9_]+)\/status\/([0-9]+)(\?[^\s]*)?/g,
        /https?:\/\/(www\.)?x\.com\/([a-zA-Z0-9_]+)\/status\/([0-9]+)(\?[^\s]*)?/g
    ];

    const redditUrlPatterns = [
        /https?:\/\/(www\.)?reddit\.com\/r\/([a-zA-Z0-9_]+)\/comments\/([a-zA-Z0-9]+)(?:\/[^\/\s]+)?(?:\/([a-zA-Z0-9]+))?/g
    ];

    let content = rawContent;

    twitterUrlPatterns.forEach(pattern => {
        content = content.replace(pattern, (match) => {
            return `<div class="twitter-embed" data-url="${match}"></div>`;
        });
    });

    redditUrlPatterns.forEach(pattern => {
        content = content.replace(pattern, (match) => {
            return `<div class="reddit-embed" data-url="${match}"></div>`;
        });
    });

    return content;
};

const loadScripts = () => {
    if (isSSR) return;

    // Load Twitter Embeds
    document.querySelectorAll('.twitter-embed').forEach(el => {
        const url = (el as HTMLElement).dataset.url;
        if (url && !el.querySelector('iframe')) {
            const blockquote = document.createElement('blockquote');
            blockquote.className = 'twitter-tweet';
            blockquote.setAttribute('data-dnt', 'true');
            blockquote.setAttribute('data-theme', 'dark');
            const link = document.createElement('a');
            link.href = url;
            blockquote.appendChild(link);
            el.appendChild(blockquote);
        }
    });
    
    if (document.querySelector('.twitter-embed') && !document.getElementById('twitter-widgets-script')) {
        const script = document.createElement('script');
        script.id = 'twitter-widgets-script';
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        document.body.appendChild(script);
    }
    
    // Load Reddit Embeds
    document.querySelectorAll('.reddit-embed').forEach(el => {
        const url = (el as HTMLElement).dataset.url;
        if (url && !el.querySelector('iframe')) {
            const card = document.createElement('div');
            card.className = 'reddit-card';
            card.setAttribute('data-embed-height', '500');
            const link = document.createElement('a');
            link.href = url;
            card.appendChild(link);
            el.appendChild(card);
        }
    });

    if (document.querySelector('.reddit-embed') && !document.getElementById('reddit-widget-script')) {
        const script = document.createElement('script');
        script.id = 'reddit-widget-script';
        script.src = 'https://embed.reddit.com/widgets.js';
        script.async = true;
        document.body.appendChild(script);
    }
};

watch(() => props.content, (newContent) => {
    processedContent.value = processContent(newContent);
    if (!isSSR) {
        // Use nextTick to ensure the DOM is updated before trying to load scripts
        import('vue').then(({ nextTick }) => {
            nextTick(() => {
                loadScripts();
            });
        });
    }
}, { immediate: true });

</script> 