/* tslint:disable */
/* eslint-disable */
/**
 * Navigate API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import * as runtime from "../runtime";
import {
  Customer,
  CustomerFromJSON,
  CustomerToJSON,
  CustomerPagination,
  CustomerPaginationFromJSON,
  CustomerPaginationToJSON,
} from "../models";

export interface DeleteCustomerRequest {
  id: string;
}

export interface GetCustomerRequest {
  id: string;
}

export interface GetCustomerListRequest {
  page?: number;
  perPage?: number;
  customerId?: string;
}

export interface PostCustomerListRequest {
  payload: Customer;
}

export interface PutCustomerRequest {
  id: string;
  payload: Customer;
}

/**
 *
 */
export class CustomerApi extends runtime.BaseAPI {
  /**
   * Only root can delete customers. **Deletion of a customer will delete all its related data.**
   * Delete one customer
   */
  async deleteCustomerRaw(
    requestParameters: DeleteCustomerRequest
  ): Promise<runtime.ApiResponse<void>> {
    if (requestParameters.id === null || requestParameters.id === undefined) {
      throw new runtime.RequiredError(
        "id",
        "Required parameter requestParameters.id was null or undefined when calling deleteCustomer."
      );
    }

    const queryParameters: runtime.HTTPQuery = {};

    const headerParameters: runtime.HTTPHeaders = {};

    if (this.configuration && this.configuration.apiKey) {
      headerParameters["authorization"] = this.configuration.apiKey(
        "authorization"
      ); // apikey authentication
    }

    const response = await this.request({
      path: `/customer/{id}`.replace(
        `{${"id"}}`,
        encodeURIComponent(String(requestParameters.id))
      ),
      method: "DELETE",
      headers: headerParameters,
      query: queryParameters,
    });

    return new runtime.VoidApiResponse(response);
  }

  /**
   * Only root can delete customers. **Deletion of a customer will delete all its related data.**
   * Delete one customer
   */
  async deleteCustomer(
    requestParameters: DeleteCustomerRequest
  ): Promise<void> {
    await this.deleteCustomerRaw(requestParameters);
  }

  /**
   * Get customer
   */
  async getCustomerRaw(
    requestParameters: GetCustomerRequest
  ): Promise<runtime.ApiResponse<Customer>> {
    if (requestParameters.id === null || requestParameters.id === undefined) {
      throw new runtime.RequiredError(
        "id",
        "Required parameter requestParameters.id was null or undefined when calling getCustomer."
      );
    }

    const queryParameters: runtime.HTTPQuery = {};

    const headerParameters: runtime.HTTPHeaders = {};

    if (this.configuration && this.configuration.apiKey) {
      headerParameters["authorization"] = this.configuration.apiKey(
        "authorization"
      ); // apikey authentication
    }

    const response = await this.request({
      path: `/customer/{id}`.replace(
        `{${"id"}}`,
        encodeURIComponent(String(requestParameters.id))
      ),
      method: "GET",
      headers: headerParameters,
      query: queryParameters,
    });

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      CustomerFromJSON(jsonValue)
    );
  }

  /**
   * Get customer
   */
  async getCustomer(requestParameters: GetCustomerRequest): Promise<Customer> {
    const response = await this.getCustomerRaw(requestParameters);
    return await response.value();
  }

  /**
   * All users are allowed to get the list of customers
   * Get customers list
   */
  async getCustomerListRaw(
    requestParameters: GetCustomerListRequest
  ): Promise<runtime.ApiResponse<CustomerPagination>> {
    const queryParameters: runtime.HTTPQuery = {};

    if (requestParameters.page !== undefined) {
      queryParameters["page"] = requestParameters.page;
    }

    if (requestParameters.perPage !== undefined) {
      queryParameters["per_page"] = requestParameters.perPage;
    }

    if (requestParameters.customerId !== undefined) {
      queryParameters["customer_id"] = requestParameters.customerId;
    }

    const headerParameters: runtime.HTTPHeaders = {};

    if (this.configuration && this.configuration.apiKey) {
      headerParameters["authorization"] = this.configuration.apiKey(
        "authorization"
      ); // apikey authentication
    }

    const response = await this.request({
      path: `/customer/`,
      method: "GET",
      headers: headerParameters,
      query: queryParameters,
    });

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      CustomerPaginationFromJSON(jsonValue)
    );
  }

  /**
   * All users are allowed to get the list of customers
   * Get customers list
   */
  async getCustomerList(
    requestParameters: GetCustomerListRequest
  ): Promise<CustomerPagination> {
    const response = await this.getCustomerListRaw(requestParameters);
    return await response.value();
  }

  /**
   * Only users with role \'root\' can create new customers.
   * Create new customer
   */
  async postCustomerListRaw(
    requestParameters: PostCustomerListRequest
  ): Promise<runtime.ApiResponse<Customer>> {
    if (
      requestParameters.payload === null ||
      requestParameters.payload === undefined
    ) {
      throw new runtime.RequiredError(
        "payload",
        "Required parameter requestParameters.payload was null or undefined when calling postCustomerList."
      );
    }

    const queryParameters: runtime.HTTPQuery = {};

    const headerParameters: runtime.HTTPHeaders = {};

    headerParameters["Content-Type"] = "application/json";

    if (this.configuration && this.configuration.apiKey) {
      headerParameters["authorization"] = this.configuration.apiKey(
        "authorization"
      ); // apikey authentication
    }

    const response = await this.request({
      path: `/customer/`,
      method: "POST",
      headers: headerParameters,
      query: queryParameters,
      body: CustomerToJSON(requestParameters.payload),
    });

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      CustomerFromJSON(jsonValue)
    );
  }

  /**
   * Only users with role \'root\' can create new customers.
   * Create new customer
   */
  async postCustomerList(
    requestParameters: PostCustomerListRequest
  ): Promise<Customer> {
    const response = await this.postCustomerListRaw(requestParameters);
    return await response.value();
  }

  /**
   * Users with role ‘admin’ can update its own customer.
   * Update customer
   */
  async putCustomerItemRaw(
    requestParameters: PutCustomerRequest
  ): Promise<runtime.ApiResponse<Customer>> {
    if (requestParameters.id === null || requestParameters.id === undefined) {
      throw new runtime.RequiredError(
        "id",
        "Required parameter requestParameters.id was null or undefined when calling putCustomer."
      );
    }

    if (
      requestParameters.payload === null ||
      requestParameters.payload === undefined
    ) {
      throw new runtime.RequiredError(
        "payload",
        "Required parameter requestParameters.payload was null or undefined when calling putCustomer."
      );
    }

    const queryParameters: runtime.HTTPQuery = {};

    const headerParameters: runtime.HTTPHeaders = {};

    headerParameters["Content-Type"] = "application/json";

    if (this.configuration && this.configuration.apiKey) {
      headerParameters["authorization"] = this.configuration.apiKey(
        "authorization"
      ); // apikey authentication
    }

    const response = await this.request({
      path: `/customer/{id}`.replace(
        `{${"id"}}`,
        encodeURIComponent(String(requestParameters.id))
      ),
      method: "PUT",
      headers: headerParameters,
      query: queryParameters,
      body: CustomerToJSON(requestParameters.payload),
    });

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      CustomerFromJSON(jsonValue)
    );
  }

  /**
   * Users with role ‘admin’ can update its own customer.
   * Update customer
   */
  async putCustomerItem(
    requestParameters: PutCustomerRequest
  ): Promise<Customer> {
    const response = await this.putCustomerItemRaw(requestParameters);
    return await response.value();
  }
}
