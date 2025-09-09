# Blockchain Certificate Verification System

A web application to issue and verify certificates using blockchain technology.  
Built with **React + Vite (TypeScript)** for the frontend, **Node.js + Express + Prisma + PostgreSQL** for the backend, and **Hardhat** for smart contracts.

---

## 🚀 Tech Stack

- **Frontend:** React, Vite, TypeScript  
- **Backend:** Node.js, Express, Prisma, PostgreSQL  
- **Blockchain:** Solidity, Hardhat  
- **Other Tools:** Ethers.js, Pinata (IPFS Storage for PDFs)  

---

## 📂 Project Structure

```
my-project/
├── backend/          # Express + Prisma backend
├── blockchain/       # Hardhat contracts and deployment scripts
├── src/              # React frontend source
├── index.html        # Frontend entry
├── vite.config.ts    # Vite config
└── package.json      # Frontend dependencies

```
- The **frontend** lives in the root directory.  
- The **backend** runs from the `backend/` folder.  
- The **blockchain** folder contains smart contracts and Hardhat configs.  

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) (>= 18.x recommended)  
- [PostgreSQL](https://www.postgresql.org/)  
- [npm](https://www.npmjs.com/)

---

## 🛠️ Setup & Run Locally

**Clone the repository**
   ```bash
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo
```
Install dependencies

Frontend (root):

```bash
npm install
```
Backend:
```bash
cd backend
npm install
```
Configure environment variables

Create .env files in both blockchain and backend directories. Example:

Blockchain (.env)

```ini
SEPOLIA_RPC_URL=//YourRpcProviderUr
PRIVATE_KEY=your-wallet-private-key
ETHERSCAN_API_KEY=""
```
Backend (backend/.env)

```ini
DATABASE_URL=postgresql://username:password@localhost:5432/dbname
JWT_SECRET=""
SEPOLIA_RPC_URL=https://YourRpcProviderUrl
PRIVATE_KEY=your-wallet-private-key
PINATA_API_KEY=""
PINATA_API_SECRET=""
```
Run the database migrations

```bash
cd backend
npx prisma migrate dev
```
Start the application

Backend:

```bash
cd backend
npm run dev
```
Frontend (in a separate terminal, from root):

```bash
npm run dev
```
Open the app in your browser:
👉 http://localhost:8080

