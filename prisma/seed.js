const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


const brandsData = [
    {
        title: 'Apple',
        description: null,
        logo: 'https://cdn-icons-png.flaticon.com/512/0/747.png',
    },
    {
        title: 'Samsung',
        description: null,
        logo: 'https://cdn-icons-png.flaticon.com/512/882/882747.png',
    },
    {
        title: 'HP',
        description: null,
        logo: 'https://cdn-icons-png.flaticon.com/512/882/882749.png',
    },
    {
        title: 'Dell',
        description: null,
        logo: 'https://cdn-icons-png.flaticon.com/512/882/882726.png',
    },
    {
        title: 'Microsoft',
        description: null,
        logo: 'https://cdn-icons-png.flaticon.com/512/882/882702.png',
    },
    {
        title: 'Lenovo',
        description: null,
        logo: 'https://cdn-icons-png.flaticon.com/512/882/882717.png',
    },
    {
        title: 'Nokia',
        description: null,
        logo: 'https://cdn-icons-png.flaticon.com/512/882/882740.png',
    },
    {
        title: 'Intel',
        description: null,
        logo: 'https://cdn-icons-png.flaticon.com/512/882/882700.png',
    },
    {
        title: 'Asus',
        description: null,
        logo: 'https://cdn-icons-png.flaticon.com/512/882/882744.png',
    },
    {
        title: 'AMD',
        description: null,
        logo: 'https://cdn-icons-png.flaticon.com/512/882/882709.png',
    },
    {
        title: 'Logitech',
        description: null,
        logo: 'https://cdn-icons-png.flaticon.com/512/882/882732.png',
    },
    {
        title: 'Gigabyte',
        description: null,
        logo: 'https://cdn-icons-png.flaticon.com/512/882/882734.png',
    },
    {
        title: 'Beats',
        description: null,
        logo: 'https://cdn-icons-png.flaticon.com/512/882/882736.png',
    },
    {
        title: 'Acer',
        description: null,
        logo: 'https://cdn-icons-png.flaticon.com/512/882/882748.png',
    },
    {
        title: 'Nvidia',
        description: null,
        logo: 'https://cdn-icons-png.flaticon.com/512/882/882731.png',
    },
    {
        title: 'Canon',
        description: null,
        logo: 'https://cdn-icons-png.flaticon.com/512/882/882719.png',
    },
    {
        title: 'Sony',
        description: null,
        logo: 'https://cdn-icons-png.flaticon.com/512/882/882713.png',
    },
    {
        title: 'SanDisk',
        description: null,
        logo: 'https://cdn-icons-png.flaticon.com/512/882/882721.png',
    },
    {
        title: 'Seagate',
        description: null,
        logo: 'https://cdn-icons-png.flaticon.com/512/882/882733.png',
    }
];

const categoriesData = [
    {
        name: 'Smartphones',
        description: null,
        logo: null,
    },
    {
        name: 'Cameras',
        description: null,
        logo: null,
    },
    {
        name: 'CPUs',
        description: null,
        logo: null,
    },
    {
        name: 'Graphic Cards',
        description: null,
        logo: null,
    },
    {
        name: 'Headphones',
        description: null,
        logo: null,
    },
    {
        name: 'Keyboards',
        description: null,
        logo: null,
    },
    {
        name: 'Memories',
        description: null,
        logo: null,
    },
    {
        name: 'Software',
        description: null,
        logo: null,
    },
    {
        name: 'HHDs',
        description: null,
        logo: null,
    },
    {
        name: 'SSDs',
        description: null,
        logo: null,
    },
    {
        name: 'USB Flashes',
        description: null,
        logo: null,
    },
    {
        name: 'Motherboards',
        description: null,
        logo: null,
    },
    {
        name: 'Laptops',
        description: null,
        logo: null,
    },
    {
        name: 'Monitors',
        description: null,
        logo: null,
    },
    {
        name: 'Mice',
        description: null,
        logo: null,
    }
];


async function main() {
    let brands = [];
    let categories = [];
    let productsList = []
    for(let brand of brandsData) {
        const createBrands = await prisma.brand.create({
            data: brand
        })
        brands.push(createBrands);
    }

    for(let category of categoriesData) {
        const createCategories = await prisma.category.create({
            data: category
        })
        categories.push(createCategories);
    }
    
    if(brands.length > 0){
        const products = [
            {
                brandId: brands.find(brand => brand.title === 'Apple').id,
                title: "iPhone 6",
                shortDescription: "The iPhone 6 stands out as an impressive feat of technology, boasting a 4.7-inch Retina HD display that is enhanced by the inclusion of IPS technology. This innovation delivers an expansive 1334-by-750-pixel resolution at a density of 326 pixels per inch, providing stunning visual clarity.",
                description: "The iPhone stands out as an impressive feat of technology, boasting a 4.7-inch Retina HD display that is enhanced by the inclusion of IPS technology. This innovation delivers an expansive 1334-by-750-pixel resolution at a density of 326 pixels per inch, providing stunning visual clarity. Furthermore, the display supports the full sRGB standard and reaches a peak brightness of 500 nits, which ensures vibrant colors and crisp details even under strong light. Complementing the screen is an impressive 1,400:1 contrast ratio that lends depth to every image and makes colors pop. <br/> This compact technological marvel is housed in a frame that is perfect for single-handed usage. It measures 138.1mm in height, 67.0mm in width, and a slim 6.9mm in depth. Despite the range of features packed into it, the iPhone weighs just 129 grams, making it comfortable to hold and carry around. But don't let its lightweight profile fool you. It comes powered by the robust A8 chip, ensuring smooth performance and seamless multitasking. The handset is further enhanced with the integration of 4G LTE5, ensuring fast internet speeds for your browsing and streaming needs. <br /> The iPhone isn't just about impressive hardware; it offers an exceptional multimedia experience as well. It supports up to 11 hours of video playback and comes with 1080p HD video recording capabilities at 30 fps or 60 fps. And for those moments when you want to capture the minutiae of life, the slow-motion video feature records at 120 fps or 240 fps. The digital zoom feature extends up to 3x for the camera, enabling you to get up close with your subjects. It comes in variants of 16GB, 32GB, and 64GB storage, ensuring you have ample space for your apps, photos, and videos. The inclusion of the Touch ID ensures a secure and personalized experience, while the Emergency SOS feature adds an extra layer of safety. All in all, the iPhone is designed to provide a top-notch smartphone experience.",
                price: null,
                discount: 5,
                rating: 4.69,
                featured: true,
                stock: 4,
                attributes: `{"colors":[{"color": ["#C0C0C0"],"color_name":"silver","images":["https://www.apple.com/v/iphone/compare/ac/images/overview/compare_iphone6_silver__gltsh2qqw56q_large.jpg"]},{"color":["#484848", "#3B3B3B"],"color_name":"space gray","images":["https://www.apple.com/v/iphone/compare/ac/images/overview/compare_iphone6_spacegray__vd2fqke8qj6e_large.jpg"]},{"color": ["#FFD700"], "color_name": "gold","images":["https://www.apple.com/v/iphone/compare/ac/images/overview/compare_iphone6_gold__ezungh2va6ie_large.jpg"]}],"capacity":["128GB","256GB","512GB","1TB"],"price":[1749,1899,2249,2599]}`,
                thumbnail: "https://www.apple.com/v/iphone/compare/ac/images/overview/compare_iphone6_silver__gltsh2qqw56q_large.jpg",
                images: '["https://www.apple.com/v/iphone/compare/ac/images/overview/compare_iphone6_gold__ezungh2va6ie_large.jpg","https://www.apple.com/v/iphone/compare/ac/images/overview/compare_iphone6_spacegray__vd2fqke8qj6e_large.jpg","https://www.apple.com/v/iphone/compare/ac/images/overview/compare_iphone6_silver__gltsh2qqw56q_large.jpg"]',
            },
            {
                brandId: brands.find(brand => brand.title === 'Apple').id,
                title: "iPhone 14 Pro",
                shortDescription: "The latest iPhone 14 Pro model is nothing short of impressive. Its central feature is a 6.1″ Super Retina XDR display, which offers stunning visual clarity and colour accuracy that make every interaction a joy.",
                description: "The latest iPhone model is nothing short of impressive. Its central feature is a 6.1″ Super Retina XDR display, which offers stunning visual clarity and colour accuracy that make every interaction a joy. The phone is designed to provide a top-tier smartphone experience, and its dimensions contribute significantly to this aim. With a height of 147.5 mm, a width of 71.5 mm, and a depth of 7.85 mm, it's crafted to sit comfortably in your hand, yet it still feels robust and substantial. Despite its large array of features and sturdy build, it weighs just 206 grams, making it remarkably light and portable. <br />When it comes to performance, the iPhone is a technological powerhouse. It's powered by the A16 Bionic chip, which boasts a 6-core CPU and 5-core GPU, delivering exceptional performance and efficiency. Complementing this robust hardware is the 16-core Neural Engine, which facilitates advanced machine learning tasks, improving the device's overall performance and capabilities. With up to 23 hours of video playback, the iPhone ensures that you can enjoy your favourite content for extended periods without worrying about battery life. <br/>The iPhone doesn't skimp on storage either, offering an array of options to cater to your needs - you can choose between 256GB, 64GB, 512GB, and even a massive 1TB. The device is also equipped with Superfast 5G5, guaranteeing lightning-fast internet speeds for streaming, gaming, and more. The Pro camera system, featuring a 48MP Main Ultra Wide Telephoto lens, delivers stunning photographs and video quality, enabling you to capture memories in vivid detail. The integration of Face ID ensures a secure and personalised user experience, while the Emergency SOS feature adds an extra layer of safety. With all these impressive specifications, the latest iPhone model truly stands out as a leader in smartphone technology.",
                price: null,
                discount: null,
                rating: 4.69,
                featured: true,
                stock: 5,
                attributes: `{"colors":[{"color":["#673AB7"], "color_name":"deep purple","images":["https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-1inch-deeppurple?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1663703840578","https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-1inch-deeppurple_AV1?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1661969351362","https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-1inch-deeppurple_AV2?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1660754255928"]},{"color":["#FFD700"],"color_name":"gold","images":["https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-1inch-gold?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1663703840519","https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-1inch-gold_AV1?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1661969351422","https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-1inch-gold_AV2?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1660754258490"]},{"color":["#C0C0C0"],"color_name":"silver","images":["https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-1inch-silver?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1663703840488","https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-1inch-silver_AV1?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1661969351381","https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-1inch-silver_AV2?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1660754259155"]},{"color":["#000C1D"],"color_name":"space black","images":["https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-1inch-spaceblack?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1663703840510","https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-1inch-spaceblack_AV1?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1661969350986","https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-1inch-spaceblack_AV2?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1660754259277"]}],"capacity":["128GB","256GB","512GB","1TB"],"price":[1749,1899,2249,2599]}`,
                thumbnail: "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-1inch_AV1?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1671474898960",
                images: '["https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-1inch?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1671474899902","https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-1inch_AV2?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1671474899258","https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-1inch_AV3?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1671474900699"]',
            },
            {
                brandId: brands.find(brand => brand.title === 'Apple').id,
                title: "iPhone 14 Pro Plus",
                shortDescription: "The latest iPhone 14 Pro model is nothing short of impressive. Its central feature is a 6.1″ Super Retina XDR display, which offers stunning visual clarity and colour accuracy that make every interaction a joy.",
                description: "The latest iPhone model is nothing short of impressive. Its central feature is a 6.1″ Super Retina XDR display, which offers stunning visual clarity and colour accuracy that make every interaction a joy. The phone is designed to provide a top-tier smartphone experience, and its dimensions contribute significantly to this aim. With a height of 147.5 mm, a width of 71.5 mm, and a depth of 7.85 mm, it's crafted to sit comfortably in your hand, yet it still feels robust and substantial. Despite its large array of features and sturdy build, it weighs just 206 grams, making it remarkably light and portable. <br />When it comes to performance, the iPhone is a technological powerhouse. It's powered by the A16 Bionic chip, which boasts a 6-core CPU and 5-core GPU, delivering exceptional performance and efficiency. Complementing this robust hardware is the 16-core Neural Engine, which facilitates advanced machine learning tasks, improving the device's overall performance and capabilities. With up to 23 hours of video playback, the iPhone ensures that you can enjoy your favourite content for extended periods without worrying about battery life. <br/>The iPhone doesn't skimp on storage either, offering an array of options to cater to your needs - you can choose between 256GB, 64GB, 512GB, and even a massive 1TB. The device is also equipped with Superfast 5G5, guaranteeing lightning-fast internet speeds for streaming, gaming, and more. The Pro camera system, featuring a 48MP Main Ultra Wide Telephoto lens, delivers stunning photographs and video quality, enabling you to capture memories in vivid detail. The integration of Face ID ensures a secure and personalised user experience, while the Emergency SOS feature adds an extra layer of safety. With all these impressive specifications, the latest iPhone model truly stands out as a leader in smartphone technology.",
                price: null,
                discount: null,
                rating: 4.55,
                stock: 5,
                attributes: `{"colors":[{"color":["#0000FF"],"color_name":"blue","images":["https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-finish-select-202209-6-7inch-blue?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1661027942322","https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-finish-select-202209-6-7inch-blue_AV1?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1661027875106","https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-finish-select-202209-6-7inch-blue_AV2?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1661028265567"]},{"color":"purple","images":["https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-finish-select-202209-6-7inch-purple?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1661027938735","https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-finish-select-202209-6-7inch-purple_AV1?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1661027854390","https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-finish-select-202209-6-7inch-purple_AV2?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1661028261503"]},{"color":["#FFFF00"],"color_name":"yellow","images":["https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-finish-select-202209-6-7inch-yellow?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1676505838319","https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-finish-select-202209-6-7inch-yellow_AV1?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1676505835395","https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-finish-select-202209-6-7inch-yellow_AV2?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1677200366650"]},{"color":["#191970"],"color_name":"midnight","images":["https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-finish-select-202209-6-7inch-midnight?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1661027925267","https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-finish-select-202209-6-7inch-midnight_AV1?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1661027825927","https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-finish-select-202209-6-7inch-midnight_AV2?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1661028248718"]},{"color":["#D9D9D9"],"color_name":"starlight","images":["https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-finish-select-202209-6-7inch-starlight?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1661027935971","https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-finish-select-202209-6-7inch-starlight_AV1?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1661027829296","https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-finish-select-202209-6-7inch-starlight_AV2?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1661028229167"]},{"color":["#FF0000"],"color_name":"red","images":["https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-finish-select-202209-6-7inch-product-red?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1661027939728","https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-finish-select-202209-6-7inch-product-red_AV1?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1661027861752","https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-finish-select-202209-6-7inch-product-red_AV2?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1661028274734"]}],"capacity":["128GB","256GB","512GB","1TB"],"price":[1749,1899,2249,2599]}`,
                thumbnail: "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-finish-select-202209-6-7inch_AV1?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1671474798353",
                images: '["https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-finish-select-202209-6-7inch?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1676506021662","https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-finish-select-202209-6-7inch_AV1?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1671474798353","https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-finish-select-202209-6-7inch_AV2?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1671474799409","https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-14-finish-select-202209-6-7inch_AV3?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1677293707305"]',
            },
            {
                brandId: brands.find(brand => brand.title === 'Samsung').id,
                title: "Galaxy S23 Ultra",
                shortDescription: "Shoot with the 200MP on the Galaxy S23 Ultra to capture ultra-fine detail. <br/> A processor that works hard, so you can play hard. Together with power-efficient technology, this chipset is fast and intelligent so you can experience incredible gaming and multitasking performance. <br /> Epic night portraits everyone will want. Share the epic Nightography shots at any time in any light on the Galaxy S23 Ultra.",
                description: "Galaxy S23 Ultra has an immersive full 6.8 inch screen* coupled with smooth refresh rate meaning fast gaming, viewing and multi-tasking without interruption. Vision Booster technology can adapt to daylight. Our stunning Ultra display is bright even in sunlight so you can enjoy what is on your screen where ever you are, without having to go inside. <br />A Long Lasting Battery that can last throughout your busy day. Freely connect, stream and share with the incredible 5,000mAh (typical) long-lasting battery.",
                price: null,
                discount: null,
                rating: 4.01,
                featured: true,
                stock: 3,
                attributes: `{"colors":[{"color":["#008000"],"color_name":"Green","images":["https://images.samsung.com/au/smartphones/galaxy-s23-ultra/buy/product_color_green.png"]},{"color":"Phantom Black","images":["https://images.samsung.com/au/smartphones/galaxy-s23-ultra/buy/product_color_phantom_black.png"]},{"color":["#E6E6FA"],"color_name":"Lavender","images":["https://images.samsung.com/au/smartphones/galaxy-s23-ultra/buy/product_color_lavender.png"]},{"color":"Cream","images":["https://images.samsung.com/au/smartphones/galaxy-s23-ultra/buy/product_color_cream.png"]}],"capacity":["256GB | 8GB","512GB | 12GB","1TB | 12 GB"],"price":[1649,1949,2349]}`,
                thumbnail: "https://images.samsung.com/au/smartphones/galaxy-s23-ultra/buy/kv_group_PC_v2.jpg",
                images: '["https://images.samsung.com/au/smartphones/galaxy-s23-ultra/buy/product_color_cream.png","https://images.samsung.com/au/smartphones/galaxy-s23-ultra/buy/product_color_phantom_black.png","https://images.samsung.com/au/smartphones/galaxy-s23-ultra/buy/product_color_lavender.png"]',
            },
            {
                brandId: brands.find(brand => brand.title === 'Sony').id,
                title: "BRAVIA XR A95K OLED MASTER Series",
                shortDescription: "Whatever you're watching, you'll see it upscaled close to 4K7 quality thanks to our unique Cognitive Processor XR™. You'll also enjoy supreme contrast on our new OLED(QD-OLED) screen that's expertly controlled by our unique technology to deliver real life depth and our widest range of beautifully accurate colours in every scene.",
                description: "Take vision and sound to the next level with Cognitive Processor XR™. Our revolutionary processor on Sony BRAVIA XR™ TVs reproduces content the way humans see and hear for an incredibly lifelike experience. It understands how the human eye focuses, cross analysing images to give real life depth, extraordinary contrast and beautifully vivid colours. <br />The new OLED(QD-OLED) panel enables our widest palette of colours, thanks to Cognitive Processor XR™. This unique processor reproduces the natural shades and hues that humans find beautiful, filling the screen with consistently vivid colours and realistic textures at all brightness levels. <br />With XR HDR Remaster, this TV can detect each object on screen, analyse its colour and adjust contrast for even more realistic pictures. Object-based processing, powered by BRAVIA XR, takes precision to a whole new level by adding adjustment of hue, saturation, brightness, motion vector, bandwidth and more. The result is exceptionally real scenes with greater depth, lifelike textures and natural colours.",
                price: 4495,
                discount: null,
                rating: 4.50,
                stock: 3,
                attributes: `{"dimensions":["65"],"price":[4495]}`,
                thumbnail: "https://www.sony.com.au/image/afced348610d62ada5f2c8e7018cbbd5?fmt=pjpeg&wid=1014&hei=396",
                images: '["https://www.sony.com.au/image/eb0698a46e5ea23b953b1e7d9e55a025?fmt=pjpeg&wid=1014&hei=396","https://www.sony.com.au/image/0b1a0d16e6d9baa253ffd556aa1fa4f6?fmt=pjpeg&wid=1014&hei=396","https://www.sony.com.au/image/f5bded67aa84fb1f153d9ee97986323d?fmt=pjpeg&wid=1014&hei=396"]',
            },
            {
                brandId: brands.find(brand => brand.title === 'Sony').id,
                title: "BRAVIA XR A90K OLED 4K Ultra HD",
                shortDescription: "Whatever you're watching, you'll see it upscaled close to 4K quality thanks to our unique Cognitive Processor XR™. You'll also enjoy striking contrast on our OLED screen that's expertly controlled by our unique technology to deliver real life depth and pure blacks in every scene.",
                description: "Take vision and sound to the next level with Cognitive Processor XR™. Our revolutionary processor on Sony BRAVIA XR™ TVs reproduces content the way humans see and hear for an incredibly lifelike experience. It understands how the human eye focuses, cross analysing images to give real life depth, extraordinary contrast and beautifully vivid colours. <br />XR OLED Contrast Pro boosts colour and contrast in bright areas for exceptionally realistic pictures defined by absolute pure blacks and peak brightness. With a temperature sensor [1] and high luminance panel [2], this OLED TV utilises our Cognitive Processor XR™ to detect screen temperature and precisely control light so pixels in bright areas are illuminated simultaneously. <br/>XR Super Resolution detects individual objects in a picture and reproduces virtually real world textures on screen. Our BRAVIA XR processor precisely analyses and processes data to power 4K pictures with four times the resolution of Full HD to enrich scenes with real world detail and texture.",
                price: null,
                discount: 5,
                rating: 4.50,
                featured: true,
                stock: 5,
                attributes: `{"dimensions":["42","48"],"price":[1995,2995]}`,
                thumbnail: "https://www.sony.com.au/image/afced348610d62ada5f2c8e7018cbbd5?fmt=pjpeg&wid=1014&hei=396",
                images: '["https://www.sony.com.au/image/62d3427975e7d0dd426609b21f69260e?fmt=pjpeg&wid=1014&hei=396","https://www.sony.com.au/image/24dae11b348dbba62939c7337fb5396e?fmt=pjpeg&wid=1014&hei=396","https://www.sony.com.au/image/253769ad37c1cfe276d95e787cb70bf3?fmt=pjpeg&wid=1014&hei=396","https://www.sony.com.au/image/37883239e3da2823a0cc0a5df72634af?fmt=pjpeg&wid=1014&hei=396"]',
            }
        ];

        for(let product of products) {
            const createProducts = await prisma.product.create({
                data: product
            })
            productsList.push(createProducts);
        }
    }

    if(productsList.length > 0 && categories.length > 0) { 
        const productCategories = [
            {
                productId: productsList.find(product => product.title === 'iPhone 6').id,
                categoryId: categories.find(category => category.name === 'Smartphones').id,
            },
            {
                productId: productsList.find(product => product.title === 'iPhone 14 Pro').id,
                categoryId: categories.find(category => category.name === 'Smartphones').id,
            },
            {
                productId: productsList.find(product => product.title === 'iPhone 14 Pro Plus').id,
                categoryId: categories.find(category => category.name === 'Smartphones').id,
            },
            {
                productId: productsList.find(product => product.title === 'Galaxy S23 Ultra').id,
                categoryId: categories.find(category => category.name === 'Smartphones').id,
            },
            {
                productId: productsList.find(product => product.title === 'BRAVIA XR A95K OLED MASTER Series').id,
                categoryId: categories.find(category => category.name === 'Monitors').id,
            },
            {
                productId: productsList.find(product => product.title === 'BRAVIA XR A90K OLED 4K Ultra HD').id,
                categoryId: categories.find(category => category.name === 'Monitors').id,
            }
        ];

        for(let category of productCategories) {
            const createProducts = await prisma.productCategory.create({
                data: category
            })
        }
    }
}

main()
    .catch((e) => {
        console.log(e);
        process.exit(1);
    })
    .finally(() => {
        prisma.$disconnect();
    })