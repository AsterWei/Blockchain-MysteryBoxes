// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract Marketplace is ReentrancyGuard {

    // Variables
    address payable public immutable feeAccount; // the account that receives fees
    uint public immutable feePercent; // the fee percentage on sales 
    uint public itemCount; 
    uint public boxprice = 200000000000000000;//0.1 eth
    address boxaddr = 0x1398f889b45CFF3Ef68Dc0E9C6611ce3021322c9;
    address payable public immutable boxplatform = payable(boxaddr);

    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        // uint fakeprice;
        address payable seller;
        bool sold;
    }

    // itemId -> Item
    mapping(uint => Item) public items;

    event Offered(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );
    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    constructor(uint _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    // Make item to offer on the marketplace
    function makeItem(IERC721 _nft, uint _tokenId) external nonReentrant {//_nftis NFT's address, Token is the index
        // require(_price > 0, "Price must be greater than zero");
        // increment itemCount
        itemCount ++;
        // transfer nft
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        // add new item to items mapping
        items[itemCount] = Item (
            itemCount,
            _nft,
            _tokenId,
            // _price,//real price
            boxprice,//fakeprice
            payable(msg.sender),
            false
        );
        // emit Offered event
        emit Offered(
            itemCount,
            address(_nft),
            _tokenId,
            // _price,
            boxprice,
            msg.sender
        );
    }

    // function paytheSeller(uint _itemId) external payable nonReentrant {
    //     uint _totalPrice = getTotalPrice(_itemId);
    //     Item storage item = items[_itemId];
    //     item.seller.transfer(item.price);
    // }

    function purchaseItem(uint _itemId) external payable nonReentrant {
        uint _totalPrice = (boxprice*(100 + feePercent))/100;
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");
        require(msg.value >= _totalPrice, "not enough ether to cover item price and market fee");
        require(!item.sold, "item already sold");
        //give platform the item price
        boxplatform.transfer(boxprice);
        // item.seller.transfer(item.fakeprice);
        feeAccount.transfer(_totalPrice - boxprice);

        // update item to sold
        item.sold = true;
        // transfer nft to buyer
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        // emit Bought event
        emit Bought(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
        );
    }
    function getTotalPrice(uint _itemId) view public returns(uint){
        return((items[_itemId].price*(100 + feePercent))/100);
    }
}