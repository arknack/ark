# Obsidian Surfaces website

This is a static, responsive website designed for GitHub Pages.

## Personalise it

- Change the showroom name, email, city and hours directly in `index.html`.
- Replace the sample image links in `index.html` with your own image URLs, or place image files in an `images` folder and use paths such as `images/living-room.jpg`.
- Place PDFs in the `brochures` folder and update the e-catalogue link in `index.html` when a new catalogue is available.

## Publish on GitHub Pages

1. Create a GitHub account at [github.com](https://github.com) if you do not have one.
2. Click the **+** button in the top-right corner, choose **New repository**, name it `ark-surfaces`, choose **Public**, then click **Create repository**.
3. On the new repository page, click **Add file** → **Upload files**.
4. Drag in `index.html`, `styles.css`, `app.js`, and any `images` or `brochures` folders you add. Do not upload the `README.md` unless you want the instructions visible in the repository.
5. Click **Commit changes**.
6. Open **Settings** → **Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select branch **main** and folder **/(root)**, then click **Save**.
7. Wait a minute or two. GitHub will show the public address, normally `https://YOUR-USERNAME.github.io/ark-surfaces/`.

Whenever you want to make a permanent update, upload the replacement files in the same repository (or use GitHub's online editor) and commit the changes. GitHub Pages will republish automatically.

## Connect your domain: architecturalknack.com

The included `CNAME` file tells GitHub Pages to use `architecturalknack.com` once the domain is connected.

1. In your domain provider's DNS settings, add these four **A** records for the root domain (`@`):
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
2. Add a **CNAME** record for `www` that points to `YOUR-USERNAME.github.io`.
3. In the GitHub repository, open **Settings** → **Pages**, enter `architecturalknack.com` under **Custom domain**, and save.
4. Once GitHub verifies the domain, enable **Enforce HTTPS**.

DNS changes can take a few minutes to 24 hours to appear worldwide.
