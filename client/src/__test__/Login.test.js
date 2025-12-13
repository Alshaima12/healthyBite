import React from 'react';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import axios from 'axios';
import Login from "../components/Login";
import authReducer from "../slices/authSlice";

// Mock axios
jest.mock("axios");

// Mock the image source
jest.mock("../images/salad-illustration.png", () => "salad-image-stub");

const mockStore = configureStore([]);

describe("Login Component Tests", () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            auth: {
                user: {
                    user: null,
                    msg: null,
                    loading: false
                }
            }
        });
        jest.clearAllMocks();
    });

    test("Match the UI of Login.js - snapshot", () => {
        const { container } = render(
            <Provider store={store}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </Provider>
        );
        expect(container).toMatchSnapshot();
    });

    test("Initial values of authSlice should be correct", () => {
        const initialAuthVal = {
            user: null,
        };
        expect(authReducer(undefined, { type: undefined })).toEqual(initialAuthVal);
    });

    test("Check if email input accepts valid email", () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </Provider>
        );

        const emailInput = screen.getByTestId("email");

        // Pass case
        fireEvent.change(emailInput, { target: { value: 'valid.email@example.com' } });
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        expect(emailRegex.test(emailInput.value)).toBe(true);
    });

    test("Check if validation error appears for empty submit", async () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </Provider>
        );

        const loginBtn = screen.getByRole('button', { name: /login/i });
        fireEvent.click(loginBtn);

        // The validation in Login.js sets error state
        const errorMsg = await screen.findByText(/Email and password are required/i);
        expect(errorMsg).toBeInTheDocument();
    });

    test("Check if API is called on valid submit", async () => {
        // Mock successful response
        axios.post.mockResolvedValueOnce({
            data: {
                user: { id: 1, name: "Test User" },
                msg: "Success"
            }
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </Provider>
        );

        const emailInput = screen.getByTestId("email");
        const passwordInput = screen.getByTestId("password");
        const loginBtn = screen.getByRole('button', { name: /login/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        fireEvent.click(loginBtn);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(1);
            expect(axios.post).toHaveBeenCalledWith('https://healthybite.onrender.com/login', {
                remail: 'test@example.com',
                rpassword: 'password123'
            });
        });
    });
});
