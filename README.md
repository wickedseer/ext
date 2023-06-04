# Extractify - AI Powered Extraction. Simplified.

## Table of Contents

- [Project Summary](#project-summary)
  - [The Issue our Project Solves](#the-issue-the-project-solves)
  - [The Idea](#the-idea)
- [Technology Implementation](#technology-implementation)
  - [Azure Services Used](#azure-services-used)
- [Presentation Materials](#presentation-materials)
  - [Website UI](#website-ui)
  - [Demo Video](#demo-video)
  - [Live Demo](#live-demo)


## Project summary

### The Issue the Project Solves

This AI tool helps in extracting data from documents commonly used for KYC such as aadhar card, pan card and GST certificate. It eliminates human error and ensures the accurate capture of data. By automating this crucial task, the tool enhances the reliability and integrity of the extracted data, facilitating efficient and error-free KYC processes for organizations across various industries.

### The Idea
The core idea of this project is to develop an AI tool using Microsoft Azure services to extract information from scanned copies of Aadhar card, PAN card, and GST document. This project aims to simplify the traditional KYC process, which is time-consuming, expensive, and prone to errors, by providing businesses with a scalable, secure, and efficient way to verify the identity of their customers.

It will leverage the power of Azure services. The web application will be hosted on Azure App Service, which provides a fully-managed platform for building, deploying, and scaling web applications. The process will begin when a customer uploads a scanned copy of their Aadhar card, PAN card, and GST document to the web application. Azure Form Recognizer will extract relevant data from these documents custom extraction models trained using Form Recognizer Studio that can recognize text, tables, and other data. The solution will use GitHub to manage the codebase, enabling seamless collaboration and version control.

In conclusion, this AI tool offers a comprehensive and efficient way for businesses to extract accurate data while reducing the cost and time associated with traditional KYC methods. The solution leverages the latest advancements in Azure services to deliver a reliable, scalable, and secure KYC solution for businesses in various industries.

## Technology Implementation

### Azure Services Used

- [Static Web Apps](https://learn.microsoft.com/en-us/azure/static-web-apps/)
to host and deploy the web application for our cloud-based KYC solution.
- [Form Recognizer Service](https://learn.microsoft.com/en-us/azure/applied-ai-services/form-recognizer/overview?view=form-recog-3.0.0) 
to automate the extraction of important data from the scanned copies of Aadhar cards, PAN cards, and GST documents.

## Presentation Materials

### Website UI
![screenshot (3)](https://github.com/wickedseer/ext/assets/84715134/31544cc5-d133-4619-b348-7167063226c4)

### Demo Video
https://github.com/wickedseer/ext/assets/84715134/f3bb8e7c-43a6-4374-8737-43c5722c59e2

### Live Demo
You can find a running system to test [here](https://blue-hill-02f50f400.3.azurestaticapps.net/)
