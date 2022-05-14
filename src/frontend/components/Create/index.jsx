import { useState } from 'react'
import { Row, Form, Button } from 'react-bootstrap'
import { create as ipfsHttpClient } from 'ipfs-http-client'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const Create = ({ marketplace, nft }) => {
    const [image, setImage] = useState('')
    const [index, setIndex] = useState('')

    const uploadToIPFS = async (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        setIndex(file.name.split('.')[0]);
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
        const config = require(`../asserts/metadata/${index}.json`);
        const rarity = config.attributes[0].value;
        if (!image) return
        try {
            const result = await client.add(JSON.stringify({ image, rarity }));
            mintThenList(result);
        } catch (error) {
            console.log("ipfs uri upload error: ", error);
        }
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
                            <Form.Control
                                type="file"
                                required
                                name="file"
                                onChange={uploadToIPFS}
                            />
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