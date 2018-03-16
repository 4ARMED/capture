# Capture

This is a very simple "Serverless" function that takes input from a POST request and, optionally, performs a redirect to a URL specified in the query string.

Why would I write something like this? It's very handy when producing proof of concepts for [open redirection](https://www.owasp.org/index.php/Unvalidated_Redirects_and_Forwards_Cheat_Sheet) issues.

## Installation

You're going to need an AWS account and the [Serverless Framework](https://serverless.com/).

*WARNING*

If you deploy this code to AWS you _might_ get charged. That's up to you to know and pay for. That said, unless you really, really hammer this function, it normally doesn't cost you a penny.

### Steps

First thing to do is clone this repo.

```git clone https://github.com/4armed/capture.git```



