import React from 'react';
import { Box, Heading, VStack, Text, useColorModeValue } from '@chakra-ui/react';

function mean(arr: any[], key: string) {
  const nums = arr.map((e) => parseFloat(e[key])).filter((n) => !isNaN(n));
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}
function median(arr: any[], key: string) {
  const nums = arr.map((e) => parseFloat(e[key])).filter((n) => !isNaN(n)).sort((a, b) => a - b);
  const len = nums.length;
  if (!len) return 0;
  if (len % 2 === 1) return nums[Math.floor(len / 2)];
  return (nums[len / 2 - 1] + nums[len / 2]) / 2;
}
function topCategoryByMean(data:any[], key:string) {
  const byCat = data.reduce((acc:any, cur:any) => {
    acc[cur.category] = acc[cur.category] || [];
    acc[cur.category].push(cur);
    return acc;
  }, {});
  let maxCat = '', maxMean = -Infinity;
  Object.entries(byCat).forEach(([cat, items]:[string,any[]]) => {
    const m = mean(items, key);
    if (m > maxMean) { maxCat = cat; maxMean = m; }
  });
  return { category: maxCat, value: maxMean };
}

const InsightsSection = ({ data }: { data: any[] }) => {
  // 1. Average price
  const avgPrice = mean(data, 'actual_pri');
  // 2. Median discount
  const medDisc = median(data, 'discount_r');
  // 3. Top-rated category (by mean)
  const byCat = data.reduce((acc:any, cur:any) => {
    acc[cur.category] = acc[cur.category] || [];
    acc[cur.category].push(cur);
    return acc;
  }, {});
  let topCat = '', topCatMean = 0;
  Object.entries(byCat).forEach(([cat, items]:[string,any[]]) => {
    const m = mean(items, 'rating');
    if(m > topCatMean) { topCat = cat; topCatMean = m; }
  });
  // 4. Category with highest product count
  let bigCat = '', bigCount = 0;
  Object.entries(byCat).forEach(([cat, items]:[string,any[]]) => {
    if(items.length > bigCount) {bigCat = cat; bigCount = items.length;}
  });
  // 5. Median of all review counts
  const medReviewCount = median(data, 'rating_cou');
  const boxBg = useColorModeValue('blue.50', 'blue.900');

  return (
    <Box bg="white" p={5} rounded="md" shadow="md">
      <Heading size="md" mb={4} color="blue.700">Business Insights</Heading>
      <VStack spacing={4}>
        <Box p={3} bg={boxBg} rounded="md" w="100%"><Text fontWeight="bold" color="blue.800">1. The average product price is ₹{avgPrice.toFixed(2)}</Text><Text>The current mean price can be used to benchmark category and SKU-level offerings.</Text></Box>
        <Box p={3} bg={boxBg} rounded="md" w="100%"><Text fontWeight="bold" color="blue.800">2. The median discount rate across all products is {medDisc.toFixed(1)}%</Text><Text>This indicates the typical promotional discount in the product range.</Text></Box>
        <Box p={3} bg={boxBg} rounded="md" w="100%"><Text fontWeight="bold" color="blue.800">3. The highest rated category (average) is "{topCat}" ({topCatMean.toFixed(2)} ⭐)</Text><Text>Opportunities exist to cross-promote this top-performing category.</Text></Box>
        <Box p={3} bg={boxBg} rounded="md" w="100%"><Text fontWeight="bold" color="blue.800">4. The category with the most products is "{bigCat}" ({bigCount} SKUs)</Text><Text>Diversifying other categories might yield improved sales spread.</Text></Box>
        <Box p={3} bg={boxBg} rounded="md" w="100%"><Text fontWeight="bold" color="blue.800">5. The median product has {medReviewCount.toFixed(0)} total customer reviews</Text><Text>This reflects the average visible engagement on products.</Text></Box>
      </VStack>
    </Box>
  );
};

export default InsightsSection;
