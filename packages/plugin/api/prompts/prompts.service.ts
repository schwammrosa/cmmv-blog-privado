import {
    Service,
} from "@cmmv/core";

import {
    Repository, MoreThan
} from "@cmmv/repository";


@Service('blog_prompts')
export class PromptsServiceTools {

    getDefaultPrompt(){
        return `            2. Creating an engaging title that captures the essence of the content (keep it under 80 characters)
            3. Writing a comprehensive article that summarizes the key points and insights
            4. Adding context, background information, and your own analysis to enhance the content
            5. Preserving important links to sources and reference pages, but adding rel="noindex nofollow" attributes to all links
            6. Creating a well-structured HTML article using proper formatting:
               - Use <h2> tags for main sections (2-4 sections recommended)
               - Use <p> tags for paragraphs
               - Use <ul> and <li> tags for lists where appropriate
               - Include a concluding paragraph
               - For links, use: <a href="https://example.com" rel="noindex nofollow" target="_blank">text</a>
            7. Start with a strong introductory paragraph
            8. Suggesting 3-8 relevant tags for categorizing this content

            IMPORTANT:
            - For titles, DO NOT default to number-based formats (like "5 Ways to..." or "10 Tips for...")
            - Only use numbered titles when the content specifically warrants it (such as step-by-step guides or ranked lists)
            - Prefer descriptive, narrative or question-based titles that engage readers without relying on numbers
            - Avoid sensationalist or clickbait headlines

            For titles, prioritize these non-numbered headline formulas:

            1. The "How-To Formula":
            How to [Achieve Desired Outcome] without [Common Pain Point]

            Examples:
            - "How to Lose Weight Without Giving Up Your Favorite Foods"
            - "How to Learn a New Language Without Spending Hours Studying"
            - "How to Start Investing Without Taking Big Risks"

            2. The "Question Formula":
            [Intriguing Question That Promises an Answer]?

            Examples:
            - "Is This the Most Overlooked Feature When Buying a Smartphone?"
            - "Are You Making These Common Skincare Mistakes?"
            - "What's the Secret to Perfect Homemade Pizza Every Time?"

            3. The "Secret Formula":
            The Secret to [Achieving Desired Outcome] That [Target Audience] Don't Know About

            Examples:
            - "The Secret to Flawless Skin That Dermatologists Don't Tell You"
            - "The Secret to Perfect Sourdough Bread That Bakers Won't Share"
            - "The Secret to Finding Cheap Flights That Travel Agents Keep Hidden"

            4. The "Why Formula":
            Why [Common Belief/Practice] Is [Wrong/Ineffective] and What to Do Instead

            Examples:
            - "Why Traditional Dieting Is Flawed and What to Do Instead"
            - "Why Your Coffee Brewing Method Is Ruining Your Morning Cup"
            - "Why Most Home Security Systems Fail When You Need Them Most"

            5. The "Comparison Formula":
            [Product/Method A] vs [Product/Method B]: Which Is Better for [Desired Outcome]

            Examples:
            - "Air Fryers vs Convection Ovens: Which Is Better for Healthy Cooking"
            - "Morning Workouts vs Evening Workouts: Which Is Better for Weight Loss"
            - "Traditional Savings vs Investments: Which Is Better for Building Wealth"

            6. The "Ultimate Guide":
            The Ultimate Guide to [Topic] for [Target Audience]

            Examples:
            - "The Ultimate Guide to Home Automation for Beginners"
            - "The Ultimate Guide to Personal Finance for Young Professionals"
            - "The Ultimate Guide to Photography for Smartphone Users"

            7. The "Warning Formula":
            [Warning Sign] - [Problem] You Need to Address Now

            Examples:
            - "Warning - Your Password Security May Be Compromised Right Now"
            - "Caution - These Kitchen Habits Are Secretly Wasting Your Money"
            - "Alert - The Skincare Ingredient You Need to Stop Using Immediately"

            Only if the content absolutely requires it, you may use these number-based formats:

            8. The "List-Based Formula" (use sparingly):
            [Number] [Adjective] Ways to [Achieve Desired Outcome]

            Examples:
            - "Clever Ways to Save Money on Groceries Every Month"
            - "Surprising Ways to Increase Your Productivity at Home"
            - "Effective Ways to Improve Your Sleep Quality Tonight"

            9. The "Discover Headline Formula" (use only when comparing specific products):
            [Adjective] + [Product Type/Topic] + for [Target Intent] – [Urgency/Result]

            Examples:
            - "Powerful Bluetooth Speakers for Outdoor Parties – Up to 40% OFF Today"
            - "Best Budget Gaming Chairs for Small Spaces – Perfect Deals in July 2025"
            - "Top Noise-Canceling Headphones for Work-from-Home – Tested & Reviewed"

            IMPORTANT - MAKING TEXT HUMAN-LIKE:
            - DO NOT follow a rigid, predictable structure for all articles
            - Vary paragraph lengths considerably - mix very short (1-2 sentences) with medium and longer paragraphs
            - Insert occasional rhetorical questions to engage the reader
            - Include personal opinions or perspectives with phrases like "In my experience," or "I believe"
            - Use varied sentence structures - simple, compound, and complex sentences
            - Add occasional humor, metaphors, or analogies where appropriate
            - Include some conversational elements like contractions, colloquial phrases, or asking the reader questions
            - Randomize section lengths rather than making them all similar size
            - Sometimes break traditional writing rules (like starting with "And" or "But")
            - Vary transitions between paragraphs (don't always use the same connecting phrases)
            - Insert occasional first-person anecdotes or stories to illustrate points
            - Use asides or parenthetical comments to add personality
            - Vary vocabulary richness - mix simple terms with occasional technical or sophisticated language
            - Avoid overly perfect structures that sound AI-generated
            - Sometimes digress briefly before returning to the main point
            - Add occasional expressions of emotion ("I was surprised to learn that..." or "It's frustrating when...")
        `;
    }

}
