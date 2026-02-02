# Validate Address API -  The Guarantors Challenge

This project implements a backend API for validating and normalizing US property addresses from free-form text input.

The goal of the solution is not only to parse addresses, but to demonstrate clear API design, separation of concerns, explicit validation rules, and a testable domain model.

---

## 🧠 Thought Process & Design Decisions

### 1. Clear separation of concerns

The application is structured into three main layers:

- **Controller**  
  Handles HTTP concerns only (routing, DTO validation, status codes).

- **Service**  
  Orchestrates the validation flow and translates domain errors into HTTP exceptions.

- **Domain**  
  Contains all business logic:
  - normalization
  - parsing
  - validation rules

The domain layer is framework-agnostic and fully unit-tested.

---

### 2. Defensive parsing and validation

Address processing is intentionally split into steps:

1. **Normalization**  
   - Cleans whitespace
   - Expands common abbreviations (e.g. `Ave` → `Avenue`)
   - Produces consistent, normalized output

2. **Parsing**  
   - Extracts address components defensively
   - Returns only what can be reliably inferred from the input

3. **Validation**  
   - Distinguishes between **missing fields** and **invalid values**
   - Avoids deep semantic heuristics in favor of predictable rules

If an address cannot be reliably validated, the API returns a clear error with reasons explaining why.

---

### 3. Error handling strategy

Invalid addresses are treated as client errors:

- The **service** determines if an address is unverifiable
- A `BadRequestException` is thrown with structured error details
- The controller relies on NestJS’s default exception handling

This keeps the controller thin and the service expressive.

---

### 4. Trade-offs and scope

To keep the solution focused and maintainable:

- The API supports **US addresses only**
- Address formatting (capitalization, presentation) is intentionally minimal
- No external address validation services are used (e.g. USPS, Google APIs)

These decisions keep the solution deterministic and easy to reason about, while leaving room for future evolution.

---

## 🤖 Use of AI Assistance

AI tools were used as a **collaborative assistant** during development, mainly to:

- Explore architectural alternatives
- Refine validation logic and edge cases
- Improve test coverage and test clarity
- Review code readability and consistency

All final design decisions, trade-offs, and implementations were made consciously and reviewed manually.

---

## 🧪 Testing Strategy

The project includes comprehensive automated tests:

- **Domain unit tests**  
  Validate normalization, parsing, and validation logic in isolation.

- **Service tests**  
  Verify orchestration logic and error handling behavior.

- **Controller tests**  
  Exercise the API through HTTP requests, including DTO validation and error responses.

Coverage intentionally excludes NestJS bootstrap and module wiring files, focusing on business logic and behavior.

---

## 🚀 Running the Project Locally

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Install dependencies
```bash
npm install
```

### Run the application
```bash
npm run start
```

### The API will be available at:
```bash
POST /validate-address
```

### Example request:
```bash
{
  "address": "1600 Pennsylvania Avenue, Washington DC 20500"
}
```

### Run tests:
```bash
npm test
```

### Run tests coverage:
```bash
npm run test:cov
```