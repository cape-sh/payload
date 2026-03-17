---
description: Manage s resources with our user-friendly HTTP REST API.
---

# Accessing CAEPE with an API

You can manage most resources provided via a standard HTTP REST API.

## Authentication

To authenticate with the API, set the `Organization` header to your organization ID (the subdomain) and the `Authentication` header to a valid access token prefixed with `Bearer `.

You must also set the `content-type` header for POST and PATCH requests to `application/x-www-form-urlencoded`.

There are two workflows you can use to get an access token:

1. [Access the API with a user account](#creating-an-access-token-for-a-user-account)
2. [Access the API with a service account](#access-the-api-with-a-service-account)

## Creating an access token for a user account

To create an access token from a user account, you need to send a `POST` request to the keycloak endpoint for your instance, for example, "https://keycloak.{ORG_DOMAIN}/realms/biqmind/protocol/openid-connect/token", with the following body:

```json
{
    "grant_type": "password",
    "client_id": "cape-client",
    "username": {USERNAME},
    "password": {PASSWORD}
}
```

The expiry time for the access token is 5 minutes.

### Convenience script

If you use Postman, you can use the following script to generate an access token:

```javascript
const expiryKey = "ACCESS_TOKEN_EXPIRY";
const tokenKey = "ACCESS_TOKEN";
let retrieveToken = false;

// Check if the access token has been set
if (pm.environment.get(tokenKey) === undefined) {
  console.log("generating new access token as it does not exist");
  retrieveToken = true;
} else {
  // Check if the access token is expired
  const expiryDateStr = pm.environment.get(expiryKey);
  if (expiryDateStr === undefined) {
    retrieveToken = true;
    console.log("generating new access token as cannot determine expiry time");
  } else {
    const expiryDate = new Date(expiryDateStr);
    const currentDate = new Date();
    if (currentDate > expiryDate) {
      retrieveToken = true;
      console.log("generating new access token as current token is expired");
    }
  }
}
// Check if we need to retrieve the token
if (retrieveToken) {
  const postRequest = {
    url: "https://keycloak.biqmind.sh/realms/{ORG_DOMAIN}/protocol/openid-connect/token",
    method: "POST",
    timeout: 0,
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: {
      mode: "urlencoded",
      urlencoded: [
        { key: "grant_type", value: "password" },
        { key: "username", value: pm.environment.get("USERNAME") },
        { key: "password", value: pm.environment.get("PASSWORD") },
        { key: "client_id", value: "cape-client" },
      ],
    },
  };
  pm.sendRequest(postRequest, function (err, res) {
    var responseJson = res.json();
    // console.log(responseJson);
    const t = new Date();
    t.setSeconds(t.getSeconds() + responseJson["expires_in"]);
    pm.environment.set(expiryKey, t.toISOString());
    pm.environment.set(tokenKey, responseJson["access_token"]);
  });
} else {
  console.log("reusing existing access token");
}
```

## Access the API with a service account

To create an access token from a service account, you need to send a `POST` request to the keycloak endpoint for your instance, for example, "https://keycloak.{ORG_DOMAIN}/realms/biqmind/protocol/openid-connect/token", with the following body:

```json
{
    "grant_type": "client_credentials",
    "client_id": {CLIENT_ID},
    "client_secret": {CLIENT_SECRET},
}
```

The expiry time for the access token is 5 minutes.

## API specifications

<swagger-ui grouped name="Application API" src="./api/Application.json"/>

<swagger-ui grouped name="Billing API" src="./api/Billing.json"/>

<swagger-ui grouped name="Cluster API" src="./api/cluster.json"/>

<swagger-ui grouped name="Configuration API" src="./api/configuration.json"/>

<swagger-ui grouped name="Deployment API" src="./api/Deployment.json"/>

<swagger-ui grouped name="Notification API" src="./api/Notification.json"/>

<swagger-ui grouped name="Notification config API" src="./api/NotificationConfig.json"/>

<swagger-ui grouped name="Schedule API" src="./api/Schedule.json"/>

<swagger-ui grouped name="Smoke test API" src="./api/Smoketest.json"/>

<swagger-ui grouped name="Snapshot API" src="./api/Snapshot.json"/>
