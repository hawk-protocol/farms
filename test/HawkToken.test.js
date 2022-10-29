const { assert } = require("chai");
const { expectRevert } = require('@openzeppelin/test-helpers');

const HawkToken = artifacts.require('HawkToken');

contract('HawkToken', ([alice, bob, carol, dev, minter]) => {
    beforeEach(async () => {
        this.hawk = await HawkToken.new({ from: minter });
    });

    it('add minter', async () => {
        await this.hawk.addMinter(alice, { from: minter });
        assert.isTrue(await this.hawk.isMinter(alice));
    });

    it('delete minter', async () => {
        await this.hawk.addMinter(alice, { from: minter });
        await this.hawk.addMinter(bob, { from: minter });
        await this.hawk.addMinter(carol, { from: minter });

        assert.equal((await this.hawk.getMinterLength()).toString(), '3');

        await this.hawk.delMinter(alice, { from: minter });
        assert.isFalse(await this.hawk.isMinter(alice));

        assert.equal((await this.hawk.getMinterLength()).toString(), '2');
    })

    it('mint', async () => {
        await this.hawk.addMinter(alice, { from: minter });
        await this.hawk.mint(alice, 1000, { from: alice });
        assert.equal((await this.hawk.balanceOf(alice)).toString(), '1000');
    });

    it('only minter', async () => {
        await expectRevert(
            this.hawk.mint(alice, 1000, { from: alice }),
            'Caller is not the minter'
        );
    });
});
