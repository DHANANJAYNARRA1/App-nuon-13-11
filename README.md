# Backend For Frontend Api - DrBingo

Nodejs application for Backend For Frontend Api for dr bingo . 

# purpose 
The project will expose multiple APIs to the client, responding with JSON data. It will query both the BetWarrior APIs and our internal database to retrieve Data Transfer Objects (DTOs) and return them to the client.

The BFF project will be designed to abstract the underlying BetWarrior APIs by providing its own interface. For example, when the client requests a /game GET endpoint, the system will fetch the game data from the BetWarrior service in the background. This approach will allow us to create a unified interface for different providers.

# structure
## DTO
Defines the shape of data being sent to or from the API.

Used for request validation and response formatting.

## Controller 

Handles incoming HTTP requests and routes them to the appropriate service.

Doesn’t contain business logic — only coordinates between the HTTP layer and the business layer.

## Service 

Contains the business logic of the application.

Handles core operations, orchestrates workflows, calls repositories, etc.

## Module 

Groups related controllers, services, and providers into a cohesive unit.

Used for dependency injection and code organization.


# DTO 
### Users.dto.ts
    email!: string;
    name!: string;
    password?: string;
    address?: string;
    city?: string;
    state?: string;
    country_id?: number;
    pincode?: string;
    dob?: Date;
    phone?: string;
    kyc_verified?: boolean;
    active?: boolean;
    created_at?: Date;
    updated_at?: Date;
    last_login?: Date;
    signup_platform?: string;
    signin_platform?: string;
    language?: string;

### Games.dto.ts
    name!: string;
    reference_code?: string;
    icon_url?: string;
    active!: boolean;
    created_at?: Date;
    updated_at?: Date;

### Deposits.dto.ts
    user_id!: number;
    amount!: number;
    payment_type!: string;
    current_balance!: number;
    previous_balance!: number;
    bonus_id!: number;
    status!: string;
    api_response: string;
    created_at?: Date;
    updated_at?: Date;

### Withdrawals.dto.ts
    user_id!: number;
    amount!: number;
    current_balance!: number;
    previous_balance!: number;
    approved_amount?: number;
    status!: string;
    api_response: string;
    created_at?: Date;
    updated_at?: Date;

### Countries.dto.ts
    name!: string;
    iso_code!: string;
    phone_code!: string;
    currency_code!: string;
    created_at?: Date;
    updated_at?: Date;

### Transactions.dto.ts
    user_id!: number;
    type!: string;
    amount!: number;
    amount_type!: string;
    current_balance!: number;
    previous_balance!: number;
    reference_id!: number;
    created_at?: Date;
    updated_at?: Date;

### Wallets.dto.ts
    user_id!: number;
    balance!: number;
    total_bets!: number;
    total_wins!: number;
    current_bonus!: number;
    total_bonus!: number;
    current_freespins!: number;
    total_freespins!: number;
    created_at?: Date;
    updated_at?: Date;



# API Endpoints
### GET /game/list
Retrieves a list of games from betwarrior API

### GET /game/fetch/:id
privaite the game id and fetch a single game from betwarrior API

## POST /api/auth/signup 

Creates a new user account. Email is required. 

### Request Body
json
{
  "email": "user@example.com", // Required
  "name": "User Name",
  "address": "User Address",
  "city": "User City",
  "state": "User State",
  "country_id": "User Country", // User will select country from list
  "pincode": "User Address Pincode",
}

### Response
json
{
  "signupUrl": "https://onboarding.betwarrior.bet.br?email=user@example.com",
  "statusCode": 200,
  "error": false
}

### Error Responses
- **409 Conflict**: User with this email already exists
- **500 Internal Server Error**: An error occurred while signing up

## POST /api/auth/login 

User login. Email is required. 

### Request Body
json
{
  "email": "user@example.com", // Required
  "password": "userPassword", // Required
}

### Response
json
{
  "sessionKey": "String",
  "statusCode": 200,
  "error": false
}

### Error Responses
- **401 Conflict**: Unauthorized User
- **500 Internal Server Error**: An error occurred while login

## GET /api/games

Get Games List

### Response
json
{
  "games": [],
  "statusCode": 200,
  "error": false
}

### Error Responses
- **500 Internal Server Error**: An error occurred while fetching games list

## GET /api/games/{{gameId}}

Launch Game

### Header
{
    "sessionKey": "String"
}

### Response
json
{
  "launchUrl": "String"
  "statusCode": 200,
  "error": false
}

### Error Responses
- **500 Internal Server Error**: An error occurred while launching game

## GET /api/user

Get User Profile

### Header
{
    "sessionKey": "String"
}

### Response
json
{
  "user": "UsersDtoObject"
  "statusCode": 200,
  "error": false
}

### Error Responses
- **500 Internal Server Error**: An error occurred while fetching user detail

## POST /api/user/deposit

User Deposit

### Request Body
json
{
  "bonusCode": "String"
}

### Response
json
{
  "depositUrl": "String", // Cashier URL
  "statusCode": 200,
  "error": false
}

### Error Responses
- **401 Conflict**: Unauthorized User
- **500 Internal Server Error**: An error occurred while depositing

## POST /api/user/withdraw

User Withdraw

### Request Body
json
{}

### Response
json
{
  "withdrawUrl": "String", // Cashier URL
  "statusCode": 200,
  "error": false
}

### Error Responses
- **401 Conflict**: Unauthorized User
- **500 Internal Server Error**: An error occurred while depositing
