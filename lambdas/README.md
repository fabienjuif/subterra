# lambdas

These are functions that are deployed to AWS.

An util CLI is writed to help deploying these functions :
`yarn publish-lambda [--clean-all] [lambdaName]`

It needs to be in bash sheel and to have this AWS CLI installed:

```sh
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```
