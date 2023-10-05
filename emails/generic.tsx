import { Tailwind } from '@react-email/tailwind';
import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import { Section } from '@react-email/section';
import { Container } from '@react-email/container';
import { Text } from '@react-email/text';
import { Preview } from '@react-email/preview';
import { Body } from '@react-email/body';
import { Hr } from '@react-email/hr';
  import * as React from 'react';
  
  interface DayNNightGenericEmailProps {
    userName: string;
    eventName: string | null;
    mainText: string;
    seconderyText: string;
  }
  
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : '';
  
  export const Generic = ({
    userName,
    eventName,
    mainText,
    seconderyText,
  }: DayNNightGenericEmailProps) => (
    <Html>
     <Tailwind>   
      <Head />
      <Body style={main}>
        <Container style={container} className='flex justify-end text-right'>
          {/* <Img
            src={`${baseUrl}/static/koala-logo.png`}
            width="170"
            height="50"
            alt="Koala"
            style={logo}
          /> */}
          <Text style={paragraph}>
            שלום
            {userName}
          </Text>

          <Text dir="ltr" style={paragraph}>
            <span className='m-1'>
              .Day&Night
            </span>
            מייל זה נשלח על ידי אפליקציית
          </Text>  

          <Text dir='ltr' style={paragraph}>
            <span>
              {
                eventName ? eventName : ""
              }
            </span>
            {mainText}
          </Text>
          
          <Text style={paragraph}>
            {
              seconderyText != ""
              ? null
              : seconderyText
            }
          </Text>
         
          <Section style={btnContainer}>
          </Section>
          <Text style={paragraph}>
            בתודה
          </Text>
          <Text dir='ltr'>
            <span className='m-1'>
              Day&Night
            </span>  
            צוות  
          </Text>
        </Container>
        <Container className='text-right'>
          <Hr style={hr} />
        </Container>
      </Body>
      </Tailwind>
    </Html>
  );
  
  export default Generic;
  
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
  