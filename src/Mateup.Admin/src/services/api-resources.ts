import type { ApiResourceProperty, ApiResources, ApiResourceScope, ApiResourceSecret, PaginationParameter } from '@/typings';
import request from '@/utils/request';

export async function getApiResources(paginationParameter: PaginationParameter): Promise<any> {
  return request('/api/ApiResources', {
    params: paginationParameter
  });
}

export async function getApiResource(apiResourceId: string): Promise<any> {
  return request(`/api/ApiResources/${apiResourceId}`);
}



export function postApiResource(data: Partial<ApiResources>) {
  return request(`/api/ApiResources`, {
    method: 'post',
    data
  })
}

export function putApiResource(ApiResourcesId: string, data: Partial<ApiResources>) {
  return request(`/api/ApiResources/${ApiResourcesId}`, {
    method: 'put',
    data
  })
}

export function patchApiResourceEnabled(ApiResourcesId: string, enabled: boolean) {
  return request(`/api/ApiResources/ApiResourcess/${ApiResourcesId}/${enabled}`, {
    method: 'patch'
  })
}

export function deleteApiResource(ApiResourcesId: string) {
  return request(`/api/ApiResources/${ApiResourcesId}`, {
    method: 'delete'
  })
}

export function deleteApiResources(ApiResourcesIds: string[]) {
  return request(`/api/ApiResources/`, {
    method: 'delete',
    data: ApiResourcesIds
  })
}

export async function getApiResourceProperties(apiResourcesId: string, paginationParameter: PaginationParameter): Promise<any> {
  return request(`/api/ApiResources/${apiResourcesId}/properties`, {
    params: paginationParameter
  });
}

export function postApiResourceProperty(apiResourcesId: string, data: Partial<ApiResourceProperty>) {
  return request(`/api/ApiResources/${apiResourcesId}/properties`, {
    method: 'post',
    data: {
      ...data,
      clientId: apiResourcesId
    }
  })
}

export function deleteApiResourceProperty(apiResourcesId: string, key: string) {
  return request(`/api/ApiResources/${apiResourcesId}/properties/${key}`, {
    method: 'delete'
  })
}

export async function getApiResourceScopes(apiResourcesId: string, paginationParameter: PaginationParameter): Promise<any> {
  return request(`/api/ApiResources/${apiResourcesId}/scopes`, {
    params: paginationParameter
  });
}

export function postApiResourceScope(apiResourcesId: string, data: Partial<ApiResourceScope>) {
  return request(`/api/ApiResources/${apiResourcesId}/scopes`, {
    method: 'post',
    data: {
      ...data,
      clientId: apiResourcesId
    }
  })
}

export function deleteApiResourceScope(apiResourcesId: string, key: string) {
  return request(`/api/ApiResources/${apiResourcesId}/scopes/${key}`, {
    method: 'delete'
  })
}

export async function getApiResourceSecrets(apiResourcesId: string, paginationParameter: PaginationParameter): Promise<any> {
  return request(`/api/ApiResources/${apiResourcesId}/secrets`, {
    params: paginationParameter
  });
}

export function postApiResourceSecret(apiResourcesId: string, data: any) {
  return request(`/api/ApiResources/${apiResourcesId}/secrets`, {
    method: 'post',
    data: {
      ...data,
      clientId: apiResourcesId
    }
  })
}

export function deleteApiResourceSecret(apiResourcesId: string, type: string, value: string) {
  return request(`/api/ApiResources/${apiResourcesId}/secrets`, {
    method: 'delete',
    data: {
      type,
      value
    }
  })
}


