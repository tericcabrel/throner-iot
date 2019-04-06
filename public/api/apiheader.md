## Usage Overview

Here are some information that should help you understand the basic usage of our RESTful API. 
Including info about authenticating equipments, making requests, responses and potential errors.



## **Headers**

Certain API calls require you to send data in a particular format as part of the API call. 
By default, all API calls expect input in `JSON` format, however you need to inform the server that you are sending a JSON-formatted payload.
And to do that you must include the `Accept => application/json` HTTP header with every call.


| Header        | Value Sample                        | When to send it                                                              |
|---------------|-------------------------------------|------------------------------------------------------------------------------|
| Accept        | `application/json`                  | MUST be sent with every endpoint.                                            |
| Content-Type  | `application/json`                  | MUST be sent when passing Data.                                              |
| AuthKey       | `{Authorization key}`               | MUST be sent whenever the endpoint requires (Authorized Equipment).            |

## **Responses**

Unless otherwise specified, all of API endpoints will return the information that you request in the JSON data format.

## **Errors**

General Errors:

| Error Code | Message                                                                               | Reason                                              |
|------------|---------------------------------------------------------------------------------------|-----------------------------------------------------|
| 401        | Access Unauthorized due to invalid authorization key. | Wrong or Bad Token.                                 |
| 404        | Resource Not Found.                                                                   | Wrong Endpoint URL.                                 |
| 405        | Method Not Allowed.                                                                   | Wrong HTTP Verb.                                 |
| 422        | Invalid Input.                                                                        | Validation Error.                                   |
| 500        | Internal Server Error.                                                       | Using wrong HTTP Verb. OR using unauthorized token.          |


## **Requests**

Calling protected endpoint (passing AuthKey Token) example:

```shell
curl -X GET -H "Accept: application/json" -H "AuthKey: ea86f6dca10f82d" -H "http://api.dispox.com/v1/organizations"
```

