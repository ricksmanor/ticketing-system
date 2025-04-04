import axios from 'axios';

const APIURL = "http://192.168.0.101:8080"; // Ensure the URL starts with http://
const ctoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJleHAiOjExNTM4MTIxNjgwf' +
    'Q.hSa8tiEWRqpOChnS0HODzKnIsiKbz2cvwuwFCOkzcds';

class ApiHandler {
    constructor() {
        this.url = APIURL;
        this.endpoints = {};
    }

    createEntity(entity) {
        this.endpoints[entity.name] = this.basicEndpoints(entity);
    }

    createEntities(entityArray) {
        entityArray.forEach(this.createEntity.bind(this));
    }

    basicEndpoints({ name }) {
        const endpoints = {};
        const resourceUrl = `${this.url}/${name}`;

        endpoints.getAll = ({ query } = {}) => {
            return axios.get(resourceUrl, {
                params: { query },
                headers: {
                    'USER_TOKEN': ctoken,
                }
            }).catch(error => {
                console.error(`Error fetching ${name}:`, error);
                throw error; // Rethrow the error for further handling
            });
        };

        endpoints.getOne = (id) => {
            return axios.get(`${resourceUrl}/${id}`, {
                headers: {
                    'USER_TOKEN': ctoken,
                }
            }).catch(error => {
                console.error(`Error fetching ${name} with ID ${id}:`, error);
                throw error; // Rethrow the error for further handling
            });
        };

        endpoints.create = (data) => {
            return axios.post(resourceUrl, data, {
                headers: {
                    'USER_TOKEN': ctoken,
                }
            }).catch(error => {
                console.error(`Error creating ${name}:`, error);
                throw error; // Rethrow the error for further handling
            });
        };

        endpoints.update = (id, data) => {
            return axios.put(`${resourceUrl}/${id}`, data, {
                headers: {
                    'USER_TOKEN': ctoken,
                }
            }).catch(error => {
                console.error(`Error updating ${name} with ID ${id}:`, error);
                throw error; // Rethrow the error for further handling
            });
        };

        endpoints.delete = (id) => {
            return axios.delete(`${resourceUrl}/${id}`, {
                headers: {
                    'USER_TOKEN': ctoken,
                }
            }).catch(error => {
                console.error(`Error deleting ${name} with ID ${id}:`, error);
                throw error; // Rethrow the error for further handling
            });
        };

        return endpoints;
    }
}

export default ApiHandler;