# SaveDaDooggies

## Who did this event involve?

@Dooggies, @DeMemeTree and the Evil Hacker

## What did bite?

The wallet address that created Dooggies collection on Opensea got compromised. Opensea was able to transfer the collection ownership over to a new wallet address. However, Dooggies were “stuck” in the compromised wallet address. The way Opensea’s compromised flag works is purely UI. It simply prevents their javascript code from interacting with the blockchain. 

The team was faced with a problem, if the wallet was unlocked the hacker could begin to manually steal NFTs or accept bids. 

## The Cure

This is where the magic is involved. To help get the team out of the situation, a program was created that allowed us to take back those NFTs regardless the UI allowed or not. This program was run by Nico in order to bring the Dooggies home for a safe rescue.

Ideally we wanted to send the Dooggies home with batch transfers. So we tested it on [Rinkeby](https://medium.com/compound-finance/the-beginners-guide-to-using-an-ethereum-test-network-95bbbc85fc1d). 
<br>[Activity can be seen here](https://testnets.opensea.io/collection/dmt?tab=activity&search[isSingleCollection]=true&search[eventTypes][0]=ASSET_TRANSFER)

When the code was delivered, Nico had the genius idea to test on [another collection](https://opensea.io/collection/tescolldoo) on mainnet. This was crucial because the batch transfer didn’t work on mainnet :( [Seen here](https://etherscan.io/tx/0xdf675cd8fb82ff16bbe25634949dcdd593fad6f226318fa748c3882d9d336ea2)

@DeMemeTree was unable to determine why it had failed and so the team reverted to transferring the NFTs one at a time instead of batches.

The script was tested locally and sent to Nico. Nico then ran the script on his day off from school :)

We <3 the Dooggies and will go to great lengths to keep them safe 

<p align="center">
<a href="https://dooggies.io" target="_blank" rel="noopener noreferrer"><img src="https://cdn.discordapp.com/attachments/813112900582637608/955472395240628274/button_dooggies-io.png"></a>
</p>

<p align="center">
<a href="https://opensea.io/collection/dooggies" target="_blank" rel="noopener noreferrer"><img src="https://cdn.discordapp.com/attachments/709084279841226782/956496063706071060/button_the-collection.png"></a>
</p>

<p align="center">
<img width="512" alt="Screen Shot 2022-03-18 at 8 50 34 AM" src="https://user-images.githubusercontent.com/101606792/159207859-72a24b2f-252f-444d-bf41-40e7801a9194.png">
</p>

