# Harold

<div id="top"></div>
<!--

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/jamestkelly/harold">
    <img src="img/harold.jpeg" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Harold</h3>

  <p align="center">
    A chatbot for our favourite Slack channel at Deloitte.
    <br />
    <a href="https://github.com/jamestkelly/harold"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/github_username/repo_name">View Demo</a>
    ·
    <a href="https://github.com/github_username/repo_name/issues">Report Bug</a>
    ·
    <a href="https://github.com/github_username/repo_name/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

This project is deployed using the [serverless](https://www.serverless.com/) framework.

Harold runs as a NodeJS Lambda which is triggered on a Cron Schedule. He uses the `groups.info` Slack API to retrieve a list of user's for a channel and then sends a question to the channel via a web-hook. You can access Harold's slack integration options from [here](https://api.slack.com/apps/A81E1D9U1).

The list of questions that Harold selects from is provided as a separate text file resource to the main application logic. If you do not have access PM `@sean` or `@Jim Kelly` on Slack to be added as a contributor.

### Blacklisting Users

Since the `groups.info` returns all members of a group, it will also return inactive users and bots. To rectify this, Harold utilises a simple blacklist mechanism which takes an array of userIDs and reselects a user in the instance where a blacklisted user is chosen. To blacklist any user, fetch their userID and add it to the `memberBlackList` array in `handler.js`. An example of this can be seen below.

```js
const memberBlacklist = [
    "U037L59QX0R", // Derek
    "U0375TKH0LU", // Jimmy
    // "U0370KT3VRC" // Aaron
  ];
```

<p align="right">
    (<a href="#top">
        Back to top
    </a>)
</p>

### Built With

* [NodeJS](https://nodejs.org/en/)
* [Serverless](https://www.serverless.com/)
* [AWS](https://aws.amazon.com/)
* [Slack API](https://api.slack.com/)

<p align="right">
    (<a href="#top">
        Back to top
    </a>)
</p>

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

You'll require both an AWS and Serverless account to deploy Harold, whereas you'll only require Serverless to run the bot locally.

* serverless

```sh
brew install serverless # Install serverless
serverless login # Login via the serverless dashboard in a web browser
```

* aws-cli
  
```sh
brew install aws # Install AWS
aws configure
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: us-east-1
Default output format [None]: json
```

#### Secrets

Additionally, you'll need to either have a copy of the `.env` file containing secrets, or you can create one yourself with the following structure.

```env
OAUTH_TOKEN=X
ENVIRONMENT=prod
U30_SLACK_CHANNEL_ID=X
U30_WEBHOOK_URL=X
```

All of these can be found through the Slack API portal.

### Running Harold Locally

1. Comment out

    ```yml
    - schedule: cron(15 23 ? * SUN-THU *)
    ```

    in the file, `serverless.yml`.

2. Within the same file, **uncomment** the following line:

    ```yml
    - httpApi: 'GET /handler'
    ```

3. Run the following series of commands.

    ```sh
    cd /path/to/repo # Change directory to the repo
    sls offline
    ```

### Deploying Harold

To deploy Harold, configure the serverless and AWS credentials locally as outlined previously in the [Prerequisites](#prerequisites) section. Then enter the following commands.

```sh
cd /path/to/repo # Change directory to the repo
sls deploy --aws-profile default --verbose
```

<p align="right">
    (<a href="#top">
        Back to top
    </a>)
</p>

### Automatic Deployment

Automatic Deployment is done within the serverless website [here](https://www.serverless.com/). An account is required to proceed.

1. First make sure it is deployed manually by running the following. 
    
    ```sh
    sls login
    sls deploy
    ```

2. The app should appear in the apps section in the website. Click on the deployment stage called prod. Then click on the settings in the top right.

3. Connect the git repo to the serverless account from this window. Connect the AWS account to the serverless account from this window too. In the branch deploys section add the master branch on stage prod.



<!-- USAGE EXAMPLES -->
## Usage

Harold will follow a `cron` schedule as is outlined in the `serverless.yml` file. Currently, the bot runs from Monday to Friday; sending a message at 10:15AM AEDT.

<p align="right">
    (<a href="#top">
        Back to top
    </a>)
</p>

<!-- ROADMAP -->
## Roadmap

* [x] Complete handover of Harold to the new team.
* [x] Update the README.
* [x] Imlpement automatic deployments (GitHub Actions) when any PR/MRs are approved to `master` branch.
* [ ] Perform an audit of the questions and remove any *bad* ones.
* [ ] Develop outline for future features and improvements.
* [ ] Add additional plans and updates here.

See the [open issues](https://github.com/jamestkelly/harold/issues) for a full list of proposed features (and known issues).

<p align="right">
    (<a href="#top">
        Back to top
    </a>)
</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">
    (<a href="#top">
        Back to top
    </a>)
</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">
    (<a href="#top">
        Back to top
    </a>)
</p>

<!-- CONTACT -->
## Contact

All contributors and project maintainers are available on Slack via their handles as can be seen below:

* `@Aaron Douglas`
* `@Houston`
* `@Jimmy Houang`
* `@Jim Kelly`
* `@Pat Randell`
* `@Rebecca Ye`
* `@ying`

<p align="right">
    (<a href="#top">
        Back to top
    </a>)
</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Thank you to the following for their efforts in creating and maintaining Harold over the years.

* [Sam Chung](https://github.com/samchungy)
* [Robert Diao](https://github.com/rldiao)
* [Harrison Smith](https://www.linkedin.com/in/harrisonoliversmith/)

### Project Board

The previous project board can be seen here as hosted on [Trello](https://trello.com/b/iAvdXVNU/harold-bot). This is now out of date and is yet to be updated regarding further developments.

<p align="right">
    (<a href="#top">
        Back to top
    </a>)
</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/jamestkelly/harold.svg?style=for-the-badge
[contributors-url]: https://github.com/jamestkelly/harold/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/jamestkelly/harold.svg?style=for-the-badge
[forks-url]: https://github.com/jamestkelly/harold/network/members
[stars-shield]: https://img.shields.io/github/stars/jamestkelly/harold.svg?style=for-the-badge
[stars-url]: https://github.com/jamestkelly/harold/stargazers
[issues-shield]: https://img.shields.io/github/issues/jamestkelly/harold.svg?style=for-the-badge
[issues-url]: https://github.com/jamestkelly/harold/issues
[license-shield]: https://img.shields.io/github/license/jamestkelly/harold.svg?style=for-the-badge
[license-url]: https://github.com/jamestkelly/harold/blob/master/LICENSE
