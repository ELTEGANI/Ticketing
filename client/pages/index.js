import buildClient from '../api/build-client';

const LandingPage = ({currentUser}) => {
   return currentUser ? <h1>You Are Sigined In</h1>:<h1>You Are Not Sigined In</h1>
};

//where get data in server side rendering
LandingPage.getInitialProps = async(context) =>{
  const client =  buildClient(context)
 const {data} = await client.get('/api/users/currentuser');
 return data;
}; 

export default LandingPage;