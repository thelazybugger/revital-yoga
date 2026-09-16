const productsBtn = document.getElementById('productsBtn');
const productsMenu = document.getElementById('productsMenu');
const chevronIcon = document.getElementById('chevronIcon');

productsBtn.addEventListener('mouseenter', () => {
    productsMenu.classList.remove('invisible', 'opacity-0', '-translate-y-2');
    productsMenu.classList.add('visible', 'opacity-100', 'translate-y-0');
    chevronIcon.classList.add('rotate-180');
});

productsBtn.addEventListener('mouseleave', () => {
    productsMenu.classList.add('invisible', 'opacity-0', '-translate-y-2');
    productsMenu.classList.remove('visible', 'opacity-100', 'translate-y-0');
    chevronIcon.classList.remove('rotate-180');
});

productsMenu.addEventListener('mouseenter', () => {
    productsMenu.classList.remove('invisible', 'opacity-0', '-translate-y-2');
    chevronIcon.classList.add('rotate-180');
});

productsMenu.addEventListener('mouseleave', () => {
    productsMenu.classList.add('invisible', 'opacity-0', '-translate-y-2');
    chevronIcon.classList.remove('rotate-180');
});

// Mobile menu open/close
const openMenu = document.getElementById('openMenu');
const closeMenu = document.getElementById('closeMenu');
const mobileMenu = document.getElementById('mobileMenu');

openMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('-translate-x-full');
});

closeMenu.addEventListener('click', () => {
    mobileMenu.classList.add('-translate-x-full');
});

// Mobile dropdown
const mobileProductsBtn = document.getElementById('mobileProductsBtn');
const mobileProductsMenu = document.getElementById('mobileProductsMenu');
const mobileChevron = document.getElementById('mobileChevron');

mobileProductsBtn.addEventListener('click', () => {
    mobileProductsMenu.classList.toggle('hidden');
    mobileChevron.classList.toggle('rotate-180');
});


// Testimonials section
const testimonialsData = [
    {
        review: 'Super clean and easy to use. These Tailwind + React components saved me hours of dev time and countless lines of extra code!',
        name: 'Richard Nelson',
        about: 'Founder & CEO',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
    },
    {
        review: 'The design quality is top-notch. Perfect balance between simplicity and style. Highly recommend for any creative developer!',
        name: 'Sophia Martinez',
        about: 'Founder & CEO',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
    },
    {
        review: 'Absolutely love the reusability of these components. My workflow feels 10x faster now with cleaner and more consistent layouts.',
        name: 'Ethan Roberts',
        about: 'Founder & CEO',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60',
    },
    {
        review: 'Clean, elegant, and efficient. These components are a dream for any modern web developer who values beautiful code.',
        name: 'Isabella Kim',
        about: 'Founder & CEO',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60',
    },
    {
        review: "I've tried dozens of UI kits, but this one just feels right. Everything works seamlessly and looks incredibly polished.",
        name: 'Liam Johnson',
        about: 'Founder & CEO',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&auto=format&fit=crop',
    },
    {
        review: 'Brilliantly structured components with clean, modern styling. Makes development a joy and design updates super quick.',
        name: 'Ava Patel',
        about: 'Founder & CEO',
        rating: 5,
        image: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/userImage/userImage1.png',
    },
];

const testimonialsContainer = document.getElementById('testimonials-container');

testimonialsData.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'w-full max-w-88 space-y-4 rounded-md border border-gray-200 bg-white p-3 text-gray-500 transition-all duration-300 hover:-translate-y-1';

    card.innerHTML = `
        <div class='flex gap-1'>
            ${Array(item.rating).fill().map((_, i) => `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star size-4 fill-gray-800 text-gray-800" aria-hidden="true">
                    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                </svg>
            `).join('')}
        </div>
        <p class='line-clamp-3'>“${item.review}”</p>
        <div class='flex items-center gap-2 pt-3'>
            <img class='size-10 rounded-full' src=${item.image} alt=${item.name} />
            <div>
                <p class='font-medium text-gray-800'>${item.name}</p>
                <p class='text-gray-500 text-xs'>${item.about}</p>
            </div>
        </div>
        </div>
    `;

    testimonialsContainer.appendChild(card);
});

// FAQ data
const faqData = [
    {
        question: "Do I need coding or design experience to use PrebuiltUI?",
        answer: "Basic coding knowledge (HTML/CSS, Tailwind) helps, but advanced design skills aren't required. You can use components as-is or customize them.",
    },
    {
        question: "What is PrebuiltUI and how does it help developers and designers?",
        answer: "PrebuiltUI provides ready-to-use, customizable UI components and templates, saving time for developers and designers.",
    },
    {
        question: "Can I use PrebuiltUI components in my existing project?",
        answer: "Yes, components can be integrated into HTML, React, Next.js, Vue, and other projects using Tailwind CSS.",
    },
    {
        question: "How customizable are the generated components?",
        answer: "Components are highly customizable with Tailwind utility classes, theming, and structural adjustments.",
    },
    {
        question: "Does PrebuiltUI support team collaboration?",
        answer: "There's no clear documentation on built-in collaboration features. Check their support for team options.",
    },
    {
        question: "Can I try PrebuiltUI before purchasing a plan?",
        answer: "Yes, you can try PrebuiltUI with full access to features.",
    },
];

const faqContainer = document.getElementById('faq-container');
let openIndex = null;

const plusIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    `;
const minusIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
      </svg>
    `;

faqData.forEach((faq, index) => {
    const item = document.createElement('div');
    item.className = 'faq-item flex flex-col border-b border-gray-200 bg-white';

    item.innerHTML = `
        <button class="flex w-full items-start justify-between py-4 text-left text-gray-800 font-medium focus:outline-none">
          <span>${faq.question}</span>
          <span class="icon">${plusIcon}</span>
        </button>
        <div class="faq-answer max-h-0 overflow-hidden text-gray-500 text-sm">
          <p class="pb-4">${faq.answer}</p>
        </div>
      `;

    const button = item.querySelector('button');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.icon');

    button.addEventListener('click', () => {
        const isOpen = openIndex === index;
        document.querySelectorAll('.faq-answer').forEach(a => {
            a.style.maxHeight = '0';
            a.previousElementSibling.querySelector('.icon').innerHTML = plusIcon;
        });
        if (!isOpen) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            icon.innerHTML = minusIcon;
            openIndex = index;
        } else {
            openIndex = null;
        }
    });

    faqContainer.appendChild(item);
});