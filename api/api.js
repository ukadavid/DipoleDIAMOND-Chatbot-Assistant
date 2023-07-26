const axios = require('axios');
const { generateRandomRequestId } = require('../requestID.js');

async function performBVNEnquiryApiCall(apiUrl, requestData) {
    try {
        const RequestId = '112131212';
        const { AccountNumber } = requestData;
        // const RequestId = generateRandomRequestId();
        // Make the API call using Axios
        const response = await axios.post(apiUrl, { RequestId, AccountNumber });

        // Handle the API response here
        console.log('API response:', response.data);

        // You can return the response data if needed
        return response.data;
    } catch (error) {
        // Handle API call errors here
        console.error('API call error:', error.data);
        return error;
    }
}
async function performAccountDetailsApiCall(apiUrl, requestData) {
    try {
        const RequestId = '112131212';
        const { AccountNumber } = requestData;
        // const RequestId = generateRandomRequestId();
        // Make the API call using Axios
        const response = await axios.post(apiUrl, { RequestId, AccountNumber });

        // Handle the API response here
        console.log('API response:', response.data);

        // You can return the response data if needed
        return response.data;
    } catch (error) {
        // Handle API call errors here
        console.error('API call error:', error.response);
        return error;
    }
}
async function performBalanceEnquiryApiCall(apiUrl, requestData) {
    try {
        const RequestId = '112131212';
        const { AccountNumber } = requestData;
        // const RequestId = generateRandomRequestId();
        // Make the API call using Axios
        const response = await axios.post(apiUrl, { RequestId, AccountNumber });

        // Handle the API response here
        console.log('API response:', response.data);

        // You can return the response data if needed
        return response.data;
    } catch (error) {
        // Handle API call errors here
        console.error('API call error:', error);
        return error;
    }
}
async function performLienEnquiryApiCall(apiUrl, requestData) {
    try {
        // const RequestId = '112131212';
        const { AccountNumber } = requestData;
        const RequestId = generateRandomRequestId();
        // Make the API call using Axios
        const response = await axios.post(apiUrl, { RequestId, AccountNumber });

        // Handle the API response here
        console.log('API response:', response.data);

        // You can return the response data if needed
        return response.data.bvn;
    } catch (error) {
        // Handle API call errors here
        console.error('API call error:', error.data);
        return error;
    }
}
async function performAccountStatusApiCall(apiUrl, requestData) {
    try {
        const RequestId = '112131212';
        const { AccountNumber } = requestData;
        // const RequestId = generateRandomRequestId();
        // Make the API call using Axios
        const response = await axios.post(apiUrl, { RequestId, AccountNumber });

        // Handle the API response here
        console.log('API response:', response.data);

        // You can return the response data if needed
        return response.data;
    } catch (error) {
        // Handle API call errors here
        console.error('API call error:', error);
        return error;
    }
}
async function performMobileEnquiryApiCall(apiUrl, requestData) {
    try {
        const RequestId = '112131212';
        const { MobileNumber } = requestData;
        // const RequestId = generateRandomRequestId();
        // Make the API call using Axios
        const response = await axios.post(apiUrl, { RequestId, MobileNumber });

        // Handle the API response here
        console.log('API response:', response.data);

        // You can return the response data if needed
        return response.data;
    } catch (error) {
        // Handle API call errors here
        console.error('API call error:', error.data);
        return error;
    }
}
async function performTransactionEnquiryApiCall(apiUrl, requestData) {
    try {
        const RequestId = '112131212';
        const { ClientReferenceId } = requestData;
        // const RequestId = generateRandomRequestId();
        // Make the API call using Axios
        const response = await axios.post(apiUrl, { RequestId, ClientReferenceId });

        // Handle the API response here
        console.log('API response:', response.data);

        // You can return the response data if needed
        return response.data;
    } catch (error) {
        // Handle API call errors here
        console.error('API call error:', error);
        return error;
    }
}
async function performStatementEnquiryApiCall(apiUrl, requestData) {
    try {
        const RequestId = '112131212';
        let { AccountNumber, StartDate, EndDate } = requestData;
        StartDate = StartDate[0].timex;
        EndDate = EndDate[0].timex;
        // const RequestId = generateRandomRequestId();
        // Make the API call using Axios
        const response = await axios.post(apiUrl, { RequestId, AccountNumber, StartDate, EndDate });

        // Handle the API response here
        console.log('API response:', response.data);

        // You can return the response data if needed
        return response.data;
    } catch (error) {
        // Handle API call errors here
        console.error('API call error:', error);
        return error;
    }
}
async function performCustomerEnquiryApiCall(apiUrl, requestData) {
    try {
        const RequestId = '112131212';
        const { CustomerId } = requestData;
        // const RequestId = generateRandomRequestId();
        // Make the API call using Axios
        const response = await axios.post(apiUrl, { RequestId, CustomerId });

        // Handle the API response here
        console.log('API response:', response.data);

        // You can return the response data if needed
        return response.data;
    } catch (error) {
        // Handle API call errors here
        console.error('API call error:', error);
        return error;
    }
}
async function performInwardTransferApiCall(apiUrl, requestData) {
    try {
        const RequestId = '112131212';
        const { AccountNumber,  Amount } = requestData;
        const SessionId = '033011121024103436003000889176';
        const FIPTransferType = 1;
        //const RequestId = generateRandomRequestId();
        let { TransactionDate } = requestData;
        TransactionDate = TransactionDate[0].timex;

        // Make the API call using Axios
        const response = await axios.post(apiUrl, { RequestId, AccountNumber, TransactionDate, Amount, SessionId, FIPTransferType });

        // Handle the API response here
        console.log('API response:', response.data);

        // You can return the response data if needed
        return response.data;
    } catch (error) {
        // Handle API call errors here
        console.error('API call error:', error.data);
        return error;
    }
}
async function performOutwardTransferApiCall(apiUrl, requestData) {
    try {
        const RequestId = '112131212';
        const { AccountNumber, Amount } = requestData;
        let { TransactionDate } = requestData;
        TransactionDate = TransactionDate[0].timex;
        const SessionId = '033011121024103436003000889176';
        const FIPTransferType = 2;
        // const RequestId = generateRandomRequestId();
        // Make the API call using Axios
        const response = await axios.post(apiUrl, { RequestId, AccountNumber, TransactionDate, Amount, SessionId, FIPTransferType });

        // Handle the API response here
        // console.log('API response:', response.data);

        // You can return the response data if needed
        return response.data;
    } catch (error) {
        // Handle API call errors here
        console.error('API call error:', error);
        return error;
    }
}
async function performChargeReversalEnquiryApiCall(apiUrl, requestData) {
    try {
        // const RequestId = '112131212';
        const { AccountNumber, StartDate, EndDate, Amount } = requestData;
        const RequestId = generateRandomRequestId();
        // Make the API call using Axios
        const response = await axios.post(apiUrl, { RequestId, AccountNumber, StartDate, Amount, EndDate });

        // Handle the API response here
        console.log('API response:', response.data);

        // You can return the response data if needed
        return response.data.bvn;
    } catch (error) {
        // Handle API call errors here
        console.error('API call error:', error.data);
        return error;
    }
}
async function performLoanEnquiryApiCall(apiUrl, requestData) {
    try {
        const RequestId = '112131212';
        const { PhoneNumber } = requestData;
        // const RequestId = generateRandomRequestId();
        // Make the API call using Axios
        const response = await axios.post(apiUrl, { RequestId, PhoneNumber });

        // Handle the API response here
        console.log('API response:', response.data);

        // You can return the response data if needed
        return response.data;
    } catch (error) {
        // Handle API call errors here
        console.error('API call error:', error);
        return error;
    }
}
async function performValidateTokenApiCall(apiUrl, requestData) {
    try {
        const RequestId = '112131212';
        const { UserId, Token } = requestData;
        // const RequestId = generateRandomRequestId();
        // Make the API call using Axios
        const response = await axios.post(apiUrl, { RequestId, UserId, Token });

        // Handle the API response here
        console.log('API response:', response);

        // You can return the response data if needed
        return response.data;
    } catch (error) {
        // Handle API call errors here
        console.error('API call error:', error);
        return error;
    }
}

module.exports = { performBVNEnquiryApiCall, performBalanceEnquiryApiCall, performLienEnquiryApiCall, performTransactionEnquiryApiCall, performAccountStatusApiCall, performMobileEnquiryApiCall, performAccountDetailsApiCall, performCustomerEnquiryApiCall, performLoanEnquiryApiCall, performStatementEnquiryApiCall, performInwardTransferApiCall, performOutwardTransferApiCall, performChargeReversalEnquiryApiCall, performValidateTokenApiCall };
