// 7.2 Request builder: Create your own Builder class around the built-in
// http.request() function. 
// The builder must be able to provide at least basic
// facilities to specify the HTTP method, the URL, the query component of
// the URL, the header parameters, and the eventual body data to be sent. To
// send the request, provide an invoke() method that returns a Promise for the
// invocation. You can find the docs for http.request() at the following URL:
// nodejsdp.link/docs-http-request.

import http from 'http';
import * as https from 'https'

// HTTP Request Builder: A Comprehensive Implementation
// This document explores HTTP concepts, the Builder pattern, and TypeScript implementation

// Define valid HTTP methods for type safety
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

/**
 * RequestBuilder implements the Builder pattern for HTTP requests
 * It provides a fluent interface to construct HTTP requests step by step
 */
class RequestBuilder {
    // Options object holds all HTTP request configuration
    private options = {
        hostname: '',   // The target server (e.g., 'api.example.com')
        port: 80,      // Default HTTP port is 80, HTTPS is 443
        path: '',      // URL path including query string
        method: 'GET' as HttpMethod,  // HTTP method to use
        headers: {}    // HTTP headers as key-value pairs
    }

    // Store body separately since it's sent via request stream, not options
    private body: string | undefined

    /**
     * Constructor now takes a URL string and parses it using the URL API
     * The URL class is a built-in JavaScript API that properly handles:
     * - Protocol (http/https)
     * - Hostname
     * - Port
     * - Path
     * - Query parameters
     * - URL encoding
     */
    constructor(url: string, method: HttpMethod = 'GET') {
        // URL constructor parses URL strings into components
        // For example, new URL('https://api.example.com:8080/users?active=true')
        // Creates an object with:
        // - protocol: 'https:'
        // - hostname: 'api.example.com'
        // - port: '8080'
        // - pathname: '/users'
        // - search: '?active=true'
        const parsed = new URL(url)
        
        this.options.hostname = parsed.hostname
        this.options.path = parsed.pathname + parsed.search
        // Set port based on protocol (http vs https)
        this.options.port = parsed.protocol === 'https:' ? 443 : 80
        this.options.method = method
    }

    /**
     * Add query parameters to the URL
     * URLSearchParams handles proper encoding of parameter values
     */
    withQueryParams(params: Record<string, string>) {
        // URLSearchParams automatically:
        // - Encodes values (spaces become %20, etc)
        // - Formats multiple parameters (key1=value1&key2=value2)
        // - Handles special characters
        const searchParams = new URLSearchParams(params)
        // Add ? if this is the first query parameter, otherwise add &
        const prefix = this.options.path.includes('?') ? '&' : '?'
        this.options.path += prefix + searchParams.toString()
        return this
    }

    /**
     * Add a single header to the request
     * Headers provide metadata about the request/response
     */
    withHeader(name: string, value: string | number) {
        if (!this.options.headers) {
            this.options.headers = {}
        }
        this.options.headers[name] = value
        return this
    }

    /**
     * Set the request body (for POST/PUT requests)
     * Automatically handles JSON conversion and sets appropriate headers
     */
    withBody(body: any) {
        // Convert body to JSON string if it's not already a string
        this.body = typeof body === 'string' ? body : JSON.stringify(body)
        
        // Set Content-Type and Content-Length headers
        // These are required for proper handling of the request body
        this.withHeader('Content-Type', 'application/json')
        this.withHeader('Content-Length', Buffer.byteLength(this.body))
        
        return this
    }

    /**
     * Execute the HTTP request
     * Uses TypeScript generics for type-safe responses
     */
    invoke<T>(): Promise<T> {
        // Create a Promise to handle the asynchronous HTTP request
        return new Promise((resolve, reject) => {
            // Choose http or https module based on port
            const requester = this.options.port === 443 ? https : http
            
            // Create the request
            const req = requester.request(this.options, (res) => {
                // HTTP responses come as streams of data
                // We need to collect all chunks before processing
                let data = ''
                
                // 'data' event fires for each chunk of response data
                res.on('data', (chunk) => {
                    data += chunk
                })
                
                // 'end' event fires when all data has been received
                res.on('end', () => {
                    try {
                        // Try to parse response as JSON
                        resolve(JSON.parse(data) as T)
                    } catch {
                        // If parsing fails, return raw data
                        resolve(data as T)
                    }
                })
            })
            
            // Handle request errors (network issues, etc)
            req.on('error', reject)
            
            // If we have a body, write it to the request stream
            if (this.body) {
                req.write(this.body)
            }
            
            // End the request stream
            // This is like sealing an envelope - it tells the server we're done sending
            req.end()
        })
    }
}

// Example usage:
async function example() {
    // Create a builder for a GET request
    const builder = new RequestBuilder('https://api.example.com/users')
    
    // Add query parameters
    builder.withQueryParams({
        active: 'true',
        role: 'admin'
    })
    
    // Execute the request
    try {
        interface UserResponse {
            id: number
            name: string
        }
        
        const response = await builder.invoke<UserResponse>()
        console.log(response.name) // TypeScript knows this exists
    } catch (error) {
        console.error('Request failed:', error)
    }
}

// POST request example:
async function postExample() {
    const builder = new RequestBuilder('https://api.example.com/users', 'POST')
        .withBody({
            name: 'John Doe',
            email: 'john@example.com'
        })
    
    const response = await builder.invoke<{id: number}>()
    console.log('Created user with ID:', response.id)
}

/**
 * Key HTTP Concepts Covered:
 * 
 * 1. Request Structure
 *    - URL (protocol, hostname, port, path, query)
 *    - Method (GET, POST, etc)
 *    - Headers (metadata)
 *    - Body (data being sent)
 * 
 * 2. Streams
 *    - HTTP uses streams for efficient data transfer
 *    - Data comes in chunks
 *    - req.write() sends request body
 *    - req.end() completes the request
 * 
 * 3. Async Nature
 *    - All HTTP operations are asynchronous
 *    - Use Promises to handle responses
 *    - Error handling is crucial
 * 
 * 4. Content Types
 *    - JSON is common but not the only option
 *    - Content-Type header tells server/client how to interpret data
 *    - Content-Length helps with transfer efficiency
 * 
 * 5. Status Codes
 *    - 2xx: Success (200 OK, 201 Created)
 *    - 3xx: Redirection
 *    - 4xx: Client Error (404 Not Found)
 *    - 5xx: Server Error
 * 
 * Additional Improvements Possible:
 * 1. Timeout handling
 * 2. Retry logic
 * 3. Response status code handling
 * 4. Custom error types
 * 5. Request/response interceptors
 * 6. Response transformation
 * 7. Cookie handling
 * 8. Proxy support
 */


// npx tsx file.ts

