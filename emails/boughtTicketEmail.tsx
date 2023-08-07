import { Tailwind } from '@react-email/tailwind';
import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import { Section } from '@react-email/section';
import { Container } from '@react-email/container';
import { Text } from '@react-email/text';
import { Preview } from '@react-email/preview';
import { Img } from '@react-email/img';
import { Body } from '@react-email/body';
import { Hr } from '@react-email/hr';
  import * as React from 'react';
  
  interface DayNNightBoughtTicketEmailProps {
    userName: string;
    eventName: string;
  }
  
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : '';
  
  export const BoughtTicketEmail = ({
    userName,
    eventName
  }: DayNNightBoughtTicketEmailProps) => (
    <Html>
     <Tailwind>   
      <Head />
      <Preview className='text-right'>
      !רכשת כרטיס
      </Preview>
      <Body style={main}>
        <Container style={container} className='flex justify-end text-right'>
          {/* <Img
            src={`${baseUrl}/static/koala-logo.png`}
            width="170"
            height="50"
            alt="Koala"
            style={logo}
          /> */}
          <Text style={paragraph}>שלום {userName}</Text>
          <Text style={paragraph}>
      מייל זה נשלח על ידי אפליקציית Day&Night.
          <Text style={paragraph}>אנו מודים לכם על רכישת כרטיס לאירוע {eventName}.</Text>
          <Text style={paragraph}>אתם תקבלו הודעה למייל זה ברגע שהמפיק יאשר או ידחה את כרטיסכם</Text>
          </Text>
          <Section style={btnContainer}>
          </Section>
          <Text style={paragraph}>
            בתודה
            <br />
            Day&Night צוות
          </Text>
        </Container>
        <Container className='text-right'>
          <Hr style={hr} />
          <Text style={footer}>טללים, טללים</Text>
        </Container>
      </Body>
      </Tailwind>
    </Html>
  );
  
  export default BoughtTicketEmail;
  
  const main = {
    backgroundColor: '#ffffff',
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  };
  
  const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
  };
  
  const logo = {
    margin: '0 auto',
  };
  
  const paragraph = {
    fontSize: '16px',
    lineHeight: '26px',
  };
  
  const btnContainer = {
    textAlign: 'center' as const,
  };
  
  const button = {
    backgroundColor: '#5F51E8',
    borderRadius: '3px',
    color: '#fff',
    fontSize: '16px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
  };
  
  const hr = {
    borderColor: '#cccccc',
  };
  
  const footer = {
    color: '#8898aa',
    fontSize: '12px',
  };
  