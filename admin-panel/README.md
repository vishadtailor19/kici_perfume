# Admin Panel for Product Management

This project is an admin panel that allows administrators to log in and manage products. The functionalities include adding new products, viewing the list of existing products, and removing products as needed.

## Project Structure

```
admin-panel
├── src
│   ├── components
│   │   ├── LoginForm.tsx
│   │   ├── ProductList.tsx
│   │   ├── AddProductForm.tsx
│   │   └── RemoveProductButton.tsx
│   ├── pages
│   │   ├── Login.tsx
│   │   └── Dashboard.tsx
│   ├── services
│   │   └── api.ts
│   ├── types
│   │   └── index.ts
│   ├── App.tsx
│   └── index.tsx
├── public
│   └── index.html
├── package.json
├── tsconfig.json
└── README.md
```

## Features

- **Admin Login**: Secure login for administrators to access the panel.
- **Product Management**: 
  - View a list of products.
  - Add new products with details such as name, description, price, and stock.
  - Remove existing products from the list.

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd admin-panel
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the application**:
   ```
   npm start
   ```

4. **Access the admin panel**:
   Open your browser and navigate to `http://localhost:3000`.

## Usage Guidelines

- Use the login form to authenticate as an admin.
- Once logged in, you will be directed to the dashboard where you can manage products.
- Fill out the form to add new products and click the submit button.
- To remove a product, click the corresponding remove button next to the product in the list.

## Technologies Used

- React
- TypeScript
- Axios (for API calls)
- CSS for styling

## License

This project is licensed under the MIT License.