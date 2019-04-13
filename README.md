# [MrDemonWolf Share Server](https://github.com/MrDemonWolf/share-mrdemonwolf-me)

## Status

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/MrDemonWolf/share-mrdemonwolf-mer/master/LICENSE)
[![dependencies Status](https://david-dm.org/MrDemonWolf/share-mrdemonwolf-me/status.svg)](https://david-dm.org/MrDemonWolf/share-mrdemonwolf-me)
[![devDependencies Status](https://david-dm.org/MrDemonWolf/share-mrdemonwolf-me/dev-status.svg)](https://david-dm.org/MrDemonWolf/share-mrdemonwolf-me?type=dev)
[![Average time to resolve an issue](https://isitmaintained.com/badge/resolution/MrDemonWolf/share-mrdemonwolf-me.svg)](https://isitmaintained.com/project/MrDemonWolf/share-mrdemonwolf-me "Average time to resolve an issue")
[![Percentage of issues still open](https://isitmaintained.com/badge/open/MrDemonWolf/share-mrdemonwolf-me.svg)](https://isitmaintained.com/project/MrDemonWolf/share-mrdemonwolf-me "Percentage of issues still open")
[![Percentage of issues still open](https://isitmaintained.com/badge/open/MrDemonWolf/share-mrdemonwolf-me.svg)](https://isitmaintained.com/project/MrDemonWolf/share-mrdemonwolf-me "Percentage of issues still open")

## Description
This a simple ShareX server so I can upload images,files, and text files on my own domain/server.  This can be used for anyone but its not supported as much.

This is made by [Nathan Henniges](https://www.github.com/nathanhenniges)

## Download and Installation

You can now download the release [here](https://github.com/MrDemonWolf/share-mrdemonwolf-me/releases/latest/download.zip)

To begin using this choose one of the following options to get started:
* Clone the repo: `git clone https://github.com/MrDemonWolf/share-mrdemonwolf-me.git`
* [Fork, Clone, or Download on GitHub](https://github.com/MrDemonWolf/share-mrdemonwolf-me)

### Usage
#### Edit the .env.example with basic config
```sh
cp .env.example .env
```
```sh
nano .env
```
Add what you want to the __.env__.
#### Install node packages
```sh
npm install
```

#### Start server
```sh
npm start
```
### Setup Account and ShareX
And go to your localhost:5050 or yourdomainproxy.com either works and click login then create a account.

You should be be able to if you disable signups as you put your email in the __.env__ .

Once done we move on the next step.

#### Here's the sharex config templates for you

[Image Imput](https://github.com/MrDemonWolf/share-mrdemonwolf-me/blob/master/template/File.sxcu)

[File Imput](https://github.com/MrDemonWolf/share-mrdemonwolf-me/blob/master/template/Image.sxcu)

[Text Imput](https://github.com/MrDemonWolf/share-mrdemonwolf-me/blob/master/template/Text.sxcu)

Just edit the domain to fit your needs and imput into sharex you can read more [here](https://getsharex.com/docs/custom-uploader)
After you done that you will have to get your API key from your account and paste it with Bear ${token} <-- the token


### Want help develop?
You can use this command to start up with nodemon so you can work on it and test.

```sh
npm run dev-web
```

### Changelog
3.0.0
* Better Gallery
* Added support for proxy more
* Now the upload link will add https based on the proxy and even the domain of the server
* Fixed login bug with tokens via the proxy trust
* Updated env template
* Added psd, doc, docx, xls, xlsx file support.
* Added better ZIP upload support
* Changed to npm start from npm run web
* Added templates for sharex imput (All you have to do is replace the name and add your API key)
* Added robots.txt.

2.0.0
* Many changes
* Better upload URLs
* View pages for files,images, and text

1.0.0
* First public build.

### Issues
Have a bug or an issue with this bot? [Open a new issue](https://github.com/MrDemonWolf/share-mrdemonwolf-me/issues) here on GitHub.

## Copyright and License

Copyright 2019 MrDemonWolf. Code released under the [MIT](https://github.com/MrDemonWolf/share-mrdemonwolf-me/blob/master/LICENSE) license.
