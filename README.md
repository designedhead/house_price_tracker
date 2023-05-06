<br/>
<p align="center">
  <h3 align="center">House Price Tracker</h3>
  <p align="center">
    House Price Tracker is a web application that allows users to track the price changes of their favourite real estate properties through Right Move.
    <br/>
    <br/>
    <a href="https://github.com/designedhead/house_price_tracker"><strong>Explore the docs »</strong></a>
    <br/>
    <br/>
    <a href="https://github.com/designedhead/house_price_tracker">View Demo</a>
    .
    <a href="https://github.com/designedhead/house_price_tracker/issues">Report Bug</a>
    .
    <a href="https://github.com/designedhead/house_price_tracker/issues">Request Feature</a>
  </p>
</p>

![Contributors](https://img.shields.io/github/contributors/designedhead/house_price_tracker?color=dark-green) ![Issues](https://img.shields.io/github/issues/designedhead/house_price_tracker) ![License](https://img.shields.io/github/license/designedhead/house_price_tracker)

## Table Of Contents

- [About the Project](#about-the-project)
- [Built With](#built-with)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [Authors](#authors)
- [Acknowledgements](#acknowledgements)

## About The Project

This project is a web application built using the Next.js T3 stack and Firebase Cloud Functions. Its purpose is to provide users with an easy and efficient way to track property prices on the Rightmove website.

Using this application, users can set up notifications for properties they are interested in and receive updates when there are any changes in the price or availability of those properties. This can be particularly useful for individuals who are in the market for a new home or investment property, as it allows them to stay informed and make informed decisions about their property purchases.

The project has been designed with user experience in mind, with a simple and intuitive interface that is easy to navigate. The use of Firebase Cloud Functions ensures that the application is both reliable and scalable, while the Next.js T3 stack provides a high level of performance and efficiency.

We believe that this project has the potential to be a valuable tool for anyone who is interested in tracking property prices on Rightmove, and we are committed to continuing to improve and develop the application to meet the changing needs of our users.

## Built With

T3 Stack

- Next.js
- Next Auth
- Prisma

Chakra UI
Firebase cloud functions

## Getting Started

Getting Started with the Project

To get started with this project, follow the steps below:

1. Clone the repository onto your local machine using the following command:

		git clone https://github.com/designedhead/house_price_tracker.git

2. Navigate to the project directory and install the dependencies using the following command:

		npm install

3. Create a .env.local file in the root of the project and populate it with the environment variables required by the application, as shown in the example below:

		DATABASE_URL=<your-database-url>
		NEXTAUTH_SECRET=<your-next-auth-secret>
		NEXTAUTH_URL=<your-next-auth-url>
		NEXT_PUBLIC_GOOGLE_SECRET=<your-google-secret>
		NEXT_PUBLIC_GOOGLE_ID=<your-google-id>
		CLOUD_FUNCTIONS_URL=<your-cloud-functions-url>


Note that when adding additional environment variables, the schema in /src/env.mjs should be updated accordingly.

4. Navigate to the cloud folder in the project directory and initialize Firebase using the following command:

		firebase init

Follow the prompts to set up Firebase for your project, making sure to select the functions option when prompted.

5. Once Firebase is set up, you can test the functions locally using the following command:

		npm run serve

This will start the Firebase emulator and allow you to test your functions locally.

6. When you are ready to deploy your functions to Firebase, use the following command:

		firebase deploy --only functions

This will deploy your functions to Firebase and make them accessible via the cloud functions URL you specified in your environment variables.

That's it! You should now have a fully functional project that you can use to track property prices on the Rightmove website. If you have any issues with setting up or using the project, feel free to refer to the documentation or open an issue in the repository.

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

- If you have suggestions for adding or removing projects, feel free to [open an issue](https://github.com/designedhead/house_price_tracker/issues/new) to discuss it, or directly create a pull request after you edit the _README.md_ file with necessary changes.
- Please make sure you check your spelling and grammar.
- Create individual PR for each suggestion.

### Creating A Pull Request

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
