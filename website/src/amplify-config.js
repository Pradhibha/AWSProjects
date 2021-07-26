
const awsConfig = {
    Auth: {
        identityPoolId: 'us-east-1:98d665d1-adfe-4f34-a3d9-1842d1c30ead', 
        region: 'US_EAST_1', 
        userPoolId: 'us-east-1_NBUlVCEwF', 
        userPoolWebClientId: '7t92ivlfojs94e1p2c4fe2l5f1' 
    },
    API: {
        endpoints: [
            {
                name: 'WildRydesAPI',
                endpoint: 'https://5dtz1k3tt3.execute-api.us-east-1.amazonaws.com', 
                region: 'us-east-1' 
            }
        ]
    },
    Storage: {
        bucket: '', 
        region: '' 
    }
}

export default awsConfig;
