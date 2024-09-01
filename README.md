<div align="center">
  <h1 align="center">ExpressJS APIs for Image Sharing platform</h1>
  <h3>Backend Stack for the image sharing platform</h3>
  <br>
  This api for testing only
  <br>
  Please wait at least 60 seconds for the first time request after idle
  <h4>https://bc43-capstone-express-orm.onrender.com</h4>
</div>

<br/>

## Main Features

- **Shareable Image:** Upload your image to platform, view images and search images.
- **Image Interaction:** Post comments on other users images, download images and like images, tag images.
For further information, please import the file below to Postman Desktop
```shell
capstone-express-orm (đã config tự gán biến token và tự reset token).postman_collection.json
```


## Getting Started

### Prerequisites

Here's what you need to be able to run Share Image:
- Node.js (version >= 18)
- MySQL Database
- Cloudinary account
- Docker Desktop

### 1. Clone the repository

```shell
git clone https://github.com/chuhaiphu/bc43-capstone-express-orm
```

### 2. Install dependencies

```shell
yarn install
```

### 3. Configure environment variables
Create a .env file in project root folder and fill in your configuration information
```shell
DB_DATABASE=
DB_USER=
DB_PASS=
DB_HOST=
DB_PORT=
DB_DIALECT=mysql
CLOUDINARY_URL=

```

### 4. Build and run with Docker
Start your Docker image MySQL Database
Run the app
```shell
yarn start
```
