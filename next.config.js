/** @type {import('next').NextConfig} */


module.exports = {
    images: {
        domains: [
            'cdn-icons-png.flaticon.com',
            'www.apple.com',
            'apple.com',
            'www.store.storeimages.cdn-apple.com',
            'store.storeimages.cdn-apple.com',
            'www.sony.com.au',
            'sony.com.au',
            'www.images.samsung.com',
            'images.samsung.com',
            'resource.logitech.com',
        ],
    },
}

// module.exports = {
//     images: {
//         remotePatterns: [
//             {
//                 protocol: 'https',
//                 hostname: 'cdn-icons-png.flaticon.com',
//                 port: '',
//                 pathname: '512/0/**',
//             },
//         ],
//     },
// }
