import React from 'react';
import { Box, Heading, VStack, Text, useColorModeValue } from '@chakra-ui/react';

function mean(arr: any[], key: string) {
  const nums = arr.map((e) => parseFloat(e[key])).filter((n) => !isNaN(n));
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

const StrategiesSection = ({ data }: { data: any[] }) => {
  const meanRating = mean(data, 'rating');
  const meanDiscount = mean(data, 'discount_r');
  const meanReview = mean(data, 'rating_cou');
  // Category with lowest rating
  const byCat = data.reduce((acc:any, cur:any) => {
    acc[cur.category] = acc[cur.category] || [];
    acc[cur.category].push(cur);
    return acc;
  }, {});
  let worstCat = '', worstMean = 100;
  Object.entries(byCat).forEach(([cat, items]:[string,any[]]) => {
    const m = mean(items, 'rating');
    if(m < worstMean) { worstCat = cat; worstMean = m; }
  });

  const strategies:string[] = [
    (meanRating < 4 ? 'Focus on improving product quality and customer satisfaction to increase overall ratings.' : 'Leverage high ratings with loyalty programs.'),
    (meanDiscount < 10 ? 'Introduce or boost promotional campaigns to enhance the average discount rate and attract price-sensitive customers.' : 'Maintain strong discounting to stay competitive.'),
    (meanReview < 30 ? 'Activate customer engagement programs to encourage more reviews and feedback for social proof.' : 'Continue fostering strong engagement with customers.'),
    (worstCat ? `Revamp product lineup or marketing for the underperforming "${worstCat}" category to unlock new growth.` : 'Identify niche category improvement zones.'),
    'Monitor trends in rating and discount analytics regularly to respond agilely to market changes.'
  ];
  const stratBg = useColorModeValue('purple.50', 'purple.900');

  return (
    <Box bg="white" p={5} rounded="md" shadow="md">
      <Heading size="md" mb={4} color="purple.700">Growth Strategies</Heading>
      <VStack spacing={4} align="stretch">
        {strategies.map((s, i) => (
          <Box key={i} bg={stratBg} p={3} rounded="md" borderLeft="5px solid #805AD5">
            <Text fontWeight="bold" color="purple.800">Strategy {i + 1}</Text>
            <Text>{s}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default StrategiesSection;
