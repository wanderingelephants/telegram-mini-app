<script setup>
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'
import WarrenBuffetIcon from './icons/IconWarrenBuffet.vue'
</script>

<template>
<div>
    <WelcomeItem>
    <template #icon>
      <icon-warren-buffet />
    </template>
    <template #heading>Principles</template>
    Long Term Investing, Low Cost Index Funds, Margin of Safety. 
    For most investors, Passive Index Funds present ideal opportunities to <b>Get Rich Slow.</b>
  </WelcomeItem>
  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>Research</template>
    Researching and tracking Stocks/MFs is not for every individual investor. Instead, do DipSip on high quality ETFs, that track market indices. On a time horizon of 3-5 years, data proves that Buying-on-Dips, the broad indices works very well.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading>Cost</template>
    Mutual Funds and PMS can charge between 1.5 to 2 % of corpus. Which means, for corpus of say 25 Lakhs, you may pay every year around 50,000.
    The fee for an ETF like Nifty Bank is only ~0.15 %. Besides cost, there is bigger risk of cyclical Mutual Fund underperformance (which is much more common than people think.
    <a href="https://economictimes.indiatimes.com/mf/analysis/63-equity-mutual-funds-fail-to-beat-benchmarks-in-3-years/articleshow/112729472.cms" target="_blank">Reference</a>) 
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    <template #heading>Automation</template>
    Let the software bring in the discipline and remove human emotions.
    We will research and bring more products suitable for long term passive investors.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <CommunityIcon />
    </template>
    <template #heading>FAQs</template>
    <b>Q. Give an example of DipSip</b>
    <br/>
    A. E.g. you have subscribed to Nifty ETF, with Amount of 10,000 and Default Allocation (1.33 %), and Default Trigger (1 %). On a given day, Nifty is down 2.4 %, which means your trigger is surpassed. The investment factor is calculated based on 2.4 - 1 = 1.4, and multiplied by 10,000, to arrive at investment amount of 14,907. 
    If the correction is more, say 3%, then investment amount becomes 17,689. This is just a recommended amount, that you can always change before placing the order.
    <br/>
    <b>Q. Correction based framework like this will lead to lost opportunities ? </b>
    <br/>
    A. On the contrary, deeper the corrections, better the margin of safety, and better long term returns. 
    Moreover, the invested corpus will be riding the up waves. During bull markets also, it is advisable to buy on dips.
    <br/>
    <b>Q. Can this work for individual Stocks ? </b>
    <br/>
    A. No. Individual stocks may never recover due to company specific reasons. Leading Indices, on the other hand, continue to rise over the long term, because they are a basket of stocks, and there is periodic clean-up to retain only good businesses.
    This strategy is effective only for few instruments.
  </WelcomeItem>

  <!--<WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Happy Investing</template>
    Write to us for feedbacks to improve the Product !
  </WelcomeItem>-->
</div>
</template>