import React, { useState } from 'react';
import Papa from 'papaparse';
import { ChakraProvider, Box, Container, Heading, VStack, SimpleGrid, Text, Button, Input, theme, Divider } from '@chakra-ui/react';
import InsightsSection from './components/InsightsSection';
import StrengthWeakness from './components/StrengthWeakness';
import StrategiesSection from './components/StrategiesSection';
import ChartsGrid from './components/ChartsGrid';

const DEMO_HEADERS = ["product_id","product_n","category","discounte","actual_pri","discount_r","rating","rating_cou","about_pro","user_id","user_name","review_id","review_tit","review_co","img_link","product_link"];

function App() {
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [filename, setFilename] = useState<string>('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFilename(file.name);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setHeaders(results.meta.fields || []);
        setData(results.data as any[]);
      },
    });
  };

  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" bgGradient="linear(to-br, blue.50, white)">
        <Container maxW="7xl" py={8}>
          <VStack spacing={6} align="stretch">
            <Heading textAlign="center" fontWeight="extrabold" bgGradient="linear(to-r, blue.600,purple.800)" bgClip="text" fontSize={{ base: '3xl', md: '5xl' }}>GenBI Product Analytics Dashboard</Heading>
            <Box borderWidth="1px" rounded="md" p={6} bg="white" shadow="md">
              <VStack spacing={3} align="flex-start">
                <Text fontWeight="semibold">Upload your product CSV file</Text>
                <Input type="file" accept=".csv" onChange={handleFile} variant="flushed" />
                <Text fontSize="sm" color="gray.500">Accepted columns: {DEMO_HEADERS.join(', ')}</Text>
                {filename && <Text fontSize="sm" color="blue.600">Loaded: {filename}</Text>}
              </VStack>
            </Box>
            <Divider />
            {data.length === 0 ? (
              <Box textAlign="center" color="gray.500" py={12}>
                <Text fontSize="lg">Please upload a CSV file to view your analytics dashboard.</Text>
              </Box>
            ) : (
              <VStack spacing={10}>
                <ChartsGrid data={data} />
                <InsightsSection data={data} />
                <StrengthWeakness data={data} />
                <StrategiesSection data={data} />
              </VStack>
            )}
          </VStack>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
