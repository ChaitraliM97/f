import React from 'react';
import { Box, Heading, SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react';

function mean(arr: any[], key: string) {
  const nums = arr.map((e) => parseFloat(e[key])).filter((n) => !isNaN(n));
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

const StrengthWeakness = ({ data }: { data: any[] }) => {
  const meanRating = mean(data, 'rating');
  const meanDiscount = mean(data, 'discount_r');
  const meanReview = mean(data, 'rating_cou');
  // Calculate categories
  const byCat = data.reduce((acc:any, cur:any) => {
    acc[cur.category] = acc[cur.category] || [];
    acc[cur.category].push(cur);
    return acc;
  }, {});
  let bestCat = '', bestMean = 0, worstCat = '', worstMean = 100;
  Object.entries(byCat).forEach(([cat, items]:[string,any[]]) => {
    const m = mean(items, 'rating');
    if(m > bestMean) { bestCat = cat; bestMean = m; }
    if(m < worstMean) { worstCat = cat; worstMean = m; }
  });

  const strengths = [
    (meanRating > 4 ? `Overall high average product rating (${meanRating.toFixed(2)} stars)` : null),
    (meanReview > 50 ? `Strong customer engagement (mean review count: ${meanReview.toFixed(0)})` : null),
    (meanDiscount > 10 ? `Attractive average discount rate (${meanDiscount.toFixed(1)}%)` : null),
    (bestCat && `Category "${bestCat}" has the top average rating (${bestMean.toFixed(2)})`)
  ].filter(Boolean);

  const weaknesses = [
    (meanRating < 3.5 ? `Low average product rating (${meanRating.toFixed(2)} stars)` : null),
    (meanDiscount < 5 ? `Low average promotional discount (${meanDiscount.toFixed(1)}%)` : null),
    (worstCat && `Category "${worstCat}" has the lowest average rating (${worstMean.toFixed(2)})`)
  ].filter(Boolean);

  const strengthBg = useColorModeValue('green.50', 'green.900');
  const weaknessBg = useColorModeValue('red.50', 'red.900');

  return (
    <Box>
      <Heading size="lg" mb={4}>Strengths & Weaknesses</Heading>
      <SimpleGrid columns={{base:1,md:2}} spacing={6}>
        <Box bg={strengthBg} borderLeft="5px solid #38A169" rounded="md" p={5} shadow="md">
          <Heading size="md" color="green.700" mb={2}>Strengths</Heading>
          {strengths.length > 0 ? strengths.map((s, i) => <Text key={i}>• {s}</Text>) : <Text>No clear strengths detected.</Text>}
        </Box>
        <Box bg={weaknessBg} borderLeft="5px solid #E53E3E" rounded="md" p={5} shadow="md">
          <Heading size="md" color="red.700" mb={2}>Weaknesses</Heading>
          {weaknesses.length > 0 ? weaknesses.map((w, i) => <Text key={i}>• {w}</Text>) : <Text>No major weaknesses detected.</Text>}
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default StrengthWeakness;
