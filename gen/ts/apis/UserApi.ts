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
  User,
  UserFromJSON,
  UserToJSON,
  UserCreate,
  UserCreateFromJSON,
  UserCreateToJSON,
  UserPagination,
  UserPaginationFromJSON,
  UserPaginationToJSON,
  UserUpdate,
  UserUpdateFromJSON,
  UserUpdateToJSON,
} from "../models";

export interface DeleteUserItemRequest {
  id: string;
}

export interface GetUserItemRequest {
  id: string;
}

export interface GetUserListRequest {
  page?: number;
  perPage?: number;
  customerId?: string;
}

export interface PostUserListRequest {
  payload: UserCreate;
}

export interface PutUserItemRequest {
  id: string;
  payload: UserUpdate;
}

/**
 *
 */
export class UserApi extends runtime.BaseAPI {
  /**
   * All refresh token for this user are eliminated. Other documents that reference this user remain unchanged.
   * Delete user
   */
  async deleteUserItemRaw(
    requestParameters: DeleteUserItemRequest
  ): Promise<runtime.ApiResponse<void>> {
    if (requestParameters.id === null || requestParameters.id === undefined) {
      throw new runtime.RequiredError(
        "id",
        "Required parameter requestParameters.id was null or undefined when calling deleteUserItem."
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
      path: `/user/{id}`.replace(
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
   * All refresh token for this user are eliminated. Other documents that reference this user remain unchanged.
   * Delete user
   */
  async deleteUserItem(
    requestParameters: DeleteUserItemRequest
  ): Promise<void> {
    await this.deleteUserItemRaw(requestParameters);
  }

  /**
   * Get user information
   */
  async getUserItemRaw(
    requestParameters: GetUserItemRequest
  ): Promise<runtime.ApiResponse<User>> {
    if (requestParameters.id === null || requestParameters.id === undefined) {
      throw new runtime.RequiredError(
        "id",
        "Required parameter requestParameters.id was null or undefined when calling getUserItem."
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
      path: `/user/{id}`.replace(
        `{${"id"}}`,
        encodeURIComponent(String(requestParameters.id))
      ),
      method: "GET",
      headers: headerParameters,
      query: queryParameters,
    });

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      UserFromJSON(jsonValue)
    );
  }

  /**
   * Get user information
   */
  async getUserItem(requestParameters: GetUserItemRequest): Promise<User> {
    const response = await this.getUserItemRaw(requestParameters);
    return await response.value();
  }

  /**
   * User with role \'root\' will can a list of users of all customers. Other roles will only get a list of users from same customer.
   * Get user list
   */
  async getUserListRaw(
    requestParameters: GetUserListRequest
  ): Promise<runtime.ApiResponse<UserPagination>> {
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
      path: `/user/`,
      method: "GET",
      headers: headerParameters,
      query: queryParameters,
    });

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      UserPaginationFromJSON(jsonValue)
    );
  }

  /**
   * User with role \'root\' will can a list of users of all customers. Other roles will only get a list of users from same customer.
   * Get user list
   */
  async getUserList(
    requestParameters: GetUserListRequest
  ): Promise<UserPagination> {
    const response = await this.getUserListRaw(requestParameters);
    return await response.value();
  }

  /**
   * **root** can create users for any customer. **admin** can create users for their same customer
   * Create new user
   */
  async postUserListRaw(
    requestParameters: PostUserListRequest
  ): Promise<runtime.ApiResponse<User>> {
    if (
      requestParameters.payload === null ||
      requestParameters.payload === undefined
    ) {
      throw new runtime.RequiredError(
        "payload",
        "Required parameter requestParameters.payload was null or undefined when calling postUserList."
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
      path: `/user/`,
      method: "POST",
      headers: headerParameters,
      query: queryParameters,
      body: UserCreateToJSON(requestParameters.payload),
    });

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      UserFromJSON(jsonValue)
    );
  }

  /**
   * **root** can create users for any customer. **admin** can create users for their same customer
   * Create new user
   */
  async postUserList(requestParameters: PostUserListRequest): Promise<User> {
    const response = await this.postUserListRaw(requestParameters);
    return await response.value();
  }

  /**
   * Update user
   */
  async putUserItemRaw(
    requestParameters: PutUserItemRequest
  ): Promise<runtime.ApiResponse<User>> {
    if (requestParameters.id === null || requestParameters.id === undefined) {
      throw new runtime.RequiredError(
        "id",
        "Required parameter requestParameters.id was null or undefined when calling putUserItem."
      );
    }

    if (
      requestParameters.payload === null ||
      requestParameters.payload === undefined
    ) {
      throw new runtime.RequiredError(
        "payload",
        "Required parameter requestParameters.payload was null or undefined when calling putUserItem."
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
      path: `/user/{id}`.replace(
        `{${"id"}}`,
        encodeURIComponent(String(requestParameters.id))
      ),
      method: "PUT",
      headers: headerParameters,
      query: queryParameters,
      body: UserUpdateToJSON(requestParameters.payload),
    });

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      UserFromJSON(jsonValue)
    );
  }

  /**
   * Update user
   */
  async putUserItem(requestParameters: PutUserItemRequest): Promise<User> {
    const response = await this.putUserItemRaw(requestParameters);
    return await response.value();
  }

  /**
   * Get user settings
   */
  async getUserSettingRaw(
    requestParameters: GetUserSettingRequest
  ): Promise<runtime.ApiResponse<UserSetting>> {
    if (requestParameters.id === null || requestParameters.id === undefined) {
      throw new runtime.RequiredError(
        "id",
        "Required parameter requestParameters.id was null or undefined when calling getUserSetting."
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
      path: `/usersettings/{id}`.replace(
        `{${"id"}}`,
        encodeURIComponent(String(requestParameters.id))
      ),
      method: "GET",
      headers: headerParameters,
      query: queryParameters,
    });

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      UserSettingFromJSON(jsonValue)
    );
  }
}
