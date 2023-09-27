<h1>eShop - Next JS</h1>
<p style="font-size: 16px;">
eShop is a project created entirely with Next.js. For the first time, I've used <code>Prisma</code> as the database.
</p>

<h2>
<span style="color: orange;">Important:</span>
</h2>
<p style="font-size: 16px;">
Setting up the entire project on your system is straightforward. However, in some cases, you may encounter the following error: <code>"Error: Cannot find module 'next/dist/compiled/next-server/app-page.runtime.dev.js'."</code> If this occurs, you can try the following steps to resolve the problem:
</p>
<ol>
<li>Remove the <code>.next</code> directory from the root.</li>
<li>Run <code>npm install next</code></li>
<li>Run <code>npm update next</code></li>
</ol><br/>
<h2>
Next-Auth Options:
</h2>
<p>
For login and registrations, I utilized the <code>next-auth</code> package. To use this package without encountering any errors, you must generate a random secret value and place it in your <code>.env.local</code> file just before <code>NEXT_PUBLIC_NEXTAUTH_SECRET</code>.

To quickly generate a random secret key, you can run the following command in your terminal:
```bash
openssl rand -base64 32
```
</p>
<h2>Usage:</h2>
For this project, it's not necessary to have third-party API keys or a specific plan. However, if you want to access the full range of features in this project, you may need the following:
<p>
<ul>
<li>A FREE account on <a href="https://uploadthing.com/" target="_blank">UploadThing</a> to upload profile images.</li>
<li>A FREE account on <a href="https://fastcourier.com.au/" target="_blank">Fast Courier</a> to access data related to Australian states, cities, suburbs, and delivery prices by sending fake package data.</li>
</ul>
Please note that you can still run this project without API keys.
</p>
<h2>Installation:</h2>
<p>To get started with the project, follow these steps:</p>
<ol>
<li>Clone the project</li>
<li>Run <code>npm install</code></li>
<li>Run <code>npx prisma migrate dev</code></li>
<li>Run <code>next dev</code></li>
</ol>
