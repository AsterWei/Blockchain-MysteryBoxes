import { useState } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'
import { create as ipfsHttpClient } from 'ipfs-http-client'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const Create = ({ marketplace, nft }) => {
    const [image, setImage] = useState('')
    // const [price, setPrice] = useState(null) // price will be stored on the block chain
    // const [name, setName] = useState('')
    // const [description, setDescription] = useState('')

    // const uploadToIPFS = async (event) => {
    //     event.preventDefault();
    //     const file = event.target.files[0];
    //     if (typeof file !== 'undefined') {
    //         try {
    //             const result = await client.add(file);
    //             // set the image link so that the file can be found on ipfs
    //             setImage(`https://ipfs.infura.io/ipfs/${result.path}`);
    //         } catch (error) {
    //             console.log("ipfs image upload error: ", error);
    //         }
    //     }
    // }

    const uploadToIPFS = async (file) => {
        if (typeof file !== 'undefined') {
            try {
                const result = await client.add(file);
                // set the image link so that the file can be found on ipfs
                setImage(`https://ipfs.infura.io/ipfs/${result.path}`);
            } catch (error) {
                console.log("ipfs image upload error: ", error);
            }
        }
    }

    const createNFT = async () => {
        // get image from file one by one
        let requireModule = require.context(
            "../asserts/images",
            false,
            /\.png$/
        );

        // upload every image
        // for (let i = 0; i < requireModule.keys().length; i++) {
        for (let i = 0; i < 1; i++) {
            // get target image
            const imageName = requireModule.keys()[i].substr(2, requireModule.keys()[i].length);
            // get image name without suffix
            const index = imageName.split('.')[0];
            const curImage = require(`../asserts/images/${index}.png`);
            const config = require(`../asserts/metadata/${index}.json`);
            const rarity = config.attributes[0].value;
            // upload the image to ipfs
            await uploadToIPFS(curImage);

            console.log(`******image${index}******`, curImage);

            if (!image) return;

            try {
                const result = await client.add(JSON.stringify({ image, rarity }));
                mintThenList(result);
            } catch (error) {
                console.log("ipfs uri upload error: ", error);
            }
        }

        // if (!image || !price || !name || !description) return
        // try {
        //     const result = await client.add(JSON.stringify({ image, price, name, description }))
        //     mintThenList(result);
        // } catch (error) {
        //     console.log("ipfs uri upload error: ", error);
        // }
    }

    const mintThenList = async (result, index) => {
        const uri = `https://ipfs.infura.io/ipfs/${result.path}`
        // mint nft 
        await (await nft.mint(uri)).wait()
        // get tokenId of new nft 
        const id = await nft.tokenCount()
        // approve marketplace to spend nft
        await (await nft.setApprovalForAll(marketplace.address, true)).wait()
        // add nft to marketplace
        await (await marketplace.makeItem(nft.address, id)).wait()
    }

    return (
        <div className="container-fluid mt-5">
            <div className="row">
                <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
                    <div className="content mx-auto">
                        <Row className="g-4">
                            {/* <Form.Control
                                type="file"
                                required
                                name="file"
                                onChange={uploadToIPFS}
                            />
                            <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
                            <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
                            <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" />
                            <div className="d-grid px-0">
                                <Button onClick={createNFT} variant="primary" size="lg">
                                    Create & List NFT!
                                </Button>
                            </div> */}
                            <div className="d-grid px-0">
                                <Button onClick={createNFT} variant="primary" size="lg">
                                    Create & List NFT!
                                </Button>
                            </div>
                        </Row>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Create