import React from 'react';
import { SimpleGrid, Box, Heading } from '@chakra-ui/react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, CartesianGrid, Legend } from 'recharts';

// Utility functions
function groupBy(arr: any[], key: string) {
  return arr.reduce((acc, v) => {
    acc[v[key]] = acc[v[key]] || [];
    acc[v[key]].push(v);
    return acc;
  }, {} as Record<string, any[]>);
}

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

const COLORS = ["#3366CC", "#DC3912", "#FF9900", "#109618", "#990099", "#0099C6", "#DD4477", "#66AA00", "#B82E2E", "#316395"];

const ChartsGrid = ({ data }: { data: any[] }) => {
  // Pre-process:
  const byCategory = groupBy(data, "category");
  const categories = Object.keys(byCategory);

  // Chart data:
  const meanPriceByCat = categories.map((cat) => ({ category: cat, meanPrice: mean(byCategory[cat], "actual_pri") }));
  const medianPriceByCat = categories.map((cat) => ({ category: cat, medianPrice: median(byCategory[cat], "actual_pri") }));
  const ratingValues = data.map((d) => parseFloat(d.rating)).filter((n) => !isNaN(n));
  const discountValues = data.map((d) => parseFloat(d.discount_r)).filter((n) => !isNaN(n));
  const ratingBuckets:Record<string,number> = {};
  ratingValues.forEach(r => {
    const b = `${Math.floor(r)}`;
    ratingBuckets[b] = (ratingBuckets[b]||0)+1;
  });
  const ratingHist = Object.entries(ratingBuckets).map(([k,v])=>({bucket: k, count: v}));

  const discBuckets:Record<string,number> = {};
  discountValues.forEach(r => {
    const b = `${10*Math.floor(r/10)}-${10*Math.floor(r/10)+9}`;
    discBuckets[b]= (discBuckets[b]||0)+1;
  });
  const discHist = Object.entries(discBuckets).map(([k,v])=>({bucket:k,count:v}));

  const ratingCountByCat = categories.map(cat => ({category: cat, ratingCount: mean(byCategory[cat], "rating_cou")}));

  const priceRatingScatter = data.filter(d => d.actual_pri && d.rating).map(d => ({x: parseFloat(d.actual_pri), y: parseFloat(d.rating)}));

  const catPie = categories.map((cat, i) => ({name: cat, value: byCategory[cat].length, fill: COLORS[i%COLORS.length]}));

  // review count histogram
  const revBuckets:Record<string,number> = {};
  data.map((d) => parseFloat(d.rating_cou)).filter((n) => !isNaN(n)).forEach(c => {
    const b = `${10*Math.floor(c/10)}-${10*Math.floor(c/10)+9}`;
    revBuckets[b]= (revBuckets[b]||0)+1;
  });
  const revHist = Object.entries(revBuckets).map(([k,v])=>({bucket:k,count:v}));

  return (
    <Box>
      <Heading size="lg" mb={4}>Key Charts</Heading>
      <SimpleGrid columns={{base:1,md:2,lg:4}} spacing={8}>
        {/* 1 Mean price by category */}
        <Box bg="white" p={3} rounded="md" shadow="md">
          <Heading size="md" mb={2}>Mean Price by Category</Heading>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={meanPriceByCat}>
              <XAxis dataKey="category" fontSize={10} hide/>
              <YAxis />
              <Tooltip />
              <Bar dataKey="meanPrice" fill="#3366CC" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
        {/* 2 Median price by category */}
        <Box bg="white" p={3} rounded="md" shadow="md">
          <Heading size="md" mb={2}>Median Price by Category</Heading>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={medianPriceByCat}>
              <XAxis dataKey="category" fontSize={10} hide/>
              <YAxis />
              <Tooltip />
              <Bar dataKey="medianPrice" fill="#DC3912" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
        {/* 3 Rating histogram */}
        <Box bg="white" p={3} rounded="md" shadow="md">
          <Heading size="md" mb={2}>Rating Distribution</Heading>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ratingHist}>
              <XAxis dataKey="bucket" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#FF9900" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
        {/* 4 Discount histogram */}
        <Box bg="white" p={3} rounded="md" shadow="md">
          <Heading size="md" mb={2}>Discount Rate Distribution</Heading>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={discHist}>
              <XAxis dataKey="bucket" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#109618" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
        {/* 5 Rating count per category */}
        <Box bg="white" p={3} rounded="md" shadow="md">
          <Heading size="md" mb={2}>Avg Rating Count per Category</Heading>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ratingCountByCat}>
              <XAxis dataKey="category" fontSize={10} hide/>
              <YAxis />
              <Tooltip />
              <Bar dataKey="ratingCount" fill="#990099" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
        {/* 6 Price vs rating scatter */}
        <Box bg="white" p={3} rounded="md" shadow="md">
          <Heading size="md" mb={2}>Price vs. Rating</Heading>
          <ResponsiveContainer width="100%" height={200}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis dataKey="x" name="Price" />
              <YAxis dataKey="y" name="Rating" />
              <Tooltip cursor={{fill:"#eee"}} />
              <Scatter data={priceRatingScatter} fill="#0099C6" />
            </ScatterChart>
          </ResponsiveContainer>
        </Box>
        {/* 7 Categories pie */}
        <Box bg="white" p={3} rounded="md" shadow="md">
          <Heading size="md" mb={2}>Product Category Share</Heading>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={catPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                {catPie.map((entry, i) => <Cell key={`cell-${i}`} fill={entry.fill} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        {/* 8 Review count histogram */}
        <Box bg="white" p={3} rounded="md" shadow="md">
          <Heading size="md" mb={2}>Review Count Distribution</Heading>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revHist}>
              <XAxis dataKey="bucket" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#66AA00" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default ChartsGrid;
