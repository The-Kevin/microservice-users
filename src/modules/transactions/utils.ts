const grpc = require('@grpc/grpc-js');
const proto = require('../../config/grcp/connection');

const Client = grpc.loadPackageDefinition(proto);

const client = new Client.TransactionService('localhost:50051', grpc.credentials.createInsecure());

export default client;
