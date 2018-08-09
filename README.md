# HTML5/JavaScript Uploader #

**Cloud Shock** - **File Uploader** 

## About ##

This project demonstrates how to implement the FineUploader control in an HTML5/JavaScript project.
It relies on AWS deployment, and SSL based web hosting via S3, Cloudfront and AWS Certificates.

## Why Did I Build It This Way? ##

By leveraging an existing control, FineUploader, and authentication management via AWS, Google and Facebook, I was able to quickly prototype and deploy a mobile web compatible file uploader. 

## How I Built the Site ## 
I built the Cloud Shock file uploader using the following tools:
* HTML/CSS/JavaScript - Based on a popular Wordpress theme
* [FineUploader](https://fineuploader.com/) - A dependency-free, open-source, native browser upload tool.
* Github - Version control
* Amazon Web Services
  * S3 - Static file hosting
  * Route 53 - DNS Mangement
  * AWS Certificate Manager - SSL certificates
  * CloudFront - SSL assignment and web hosting
  * Amazon Seller Central - Authentication
  * Google Identity Platform - Authentication
  * Facebook for developers - Authentication
  
## Demo ##
Working demo can be found here [https://cloudshock.io/uploader/]

## Roadmap - What's Next?? ## 

My near term roadmap for this project includes
* Adding AWS SNS (email, SMS) notifications
* File metadata embedding and retention
* Workflow automation for uploaded files
