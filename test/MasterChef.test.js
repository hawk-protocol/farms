const { expectRevert, time } = require('@openzeppelin/test-helpers');
const HawkToken = artifacts.require('HawkToken');
const SyrupBar = artifacts.require('SyrupBar');
const MasterChef = artifacts.require('MasterChef');
const MockBEP20 = artifacts.require('libs/MockBEP20');

contract('MasterChef', ([alice, bob, carol, dev, minter]) => {
    beforeEach(async () => {
        this.hawk = await HawkToken.new({ from: minter });
        this.syrup = await SyrupBar.new(this.hawk.address, { from: minter });
        this.lp1 = await MockBEP20.new('LPToken', 'HLP', '1000000', { from: minter });
        this.lp2 = await MockBEP20.new('LPToken', 'HLP', '1000000', { from: minter });
        this.lp3 = await MockBEP20.new('LPToken', 'HLP', '1000000', { from: minter });
        this.chef = await MasterChef.new(this.hawk.address, this.syrup.address, dev, '1000', '100', { from: minter });

        // await this.hawk.mint(this.syrup.address, '1000000', { from: minter });
        // await this.hawk.transferOwnership(this.chef.address, { from: minter });
        await this.hawk.addMinter(this.chef.address, { from: minter });
        await this.syrup.transferOwnership(this.chef.address, { from: minter });

        await this.lp1.transfer(bob, '2000', { from: minter });
        await this.lp2.transfer(bob, '2000', { from: minter });
        await this.lp3.transfer(bob, '2000', { from: minter });       

        await this.lp1.transfer(alice, '2000', { from: minter });
        await this.lp2.transfer(alice, '2000', { from: minter });
        await this.lp3.transfer(alice, '2000', { from: minter });
    });
    it('real case', async () => {
      this.lp4 = await MockBEP20.new('LPToken', 'HLP', '1000000', { from: minter });
      this.lp5 = await MockBEP20.new('LPToken', 'HLP', '1000000', { from: minter });
      this.lp6 = await MockBEP20.new('LPToken', 'HLP', '1000000', { from: minter });
      this.lp7 = await MockBEP20.new('LPToken', 'HLP', '1000000', { from: minter });
      this.lp8 = await MockBEP20.new('LPToken', 'HLP', '1000000', { from: minter });
      this.lp9 = await MockBEP20.new('LPToken', 'HLP', '1000000', { from: minter });
      await this.chef.add('2000', this.lp1.address, true, { from: minter });
      await this.chef.add('1000', this.lp2.address, true, { from: minter });
      await this.chef.add('500', this.lp3.address, true, { from: minter });
      await this.chef.add('500', this.lp4.address, true, { from: minter });
      await this.chef.add('500', this.lp5.address, true, { from: minter });
      await this.chef.add('500', this.lp6.address, true, { from: minter });
      await this.chef.add('500', this.lp7.address, true, { from: minter });
      await this.chef.add('100', this.lp8.address, true, { from: minter });
      await this.chef.add('100', this.lp9.address, true, { from: minter });
      assert.equal((await this.chef.poolLength()).toString(), "10");

      await time.advanceBlockTo('170');
      await this.lp1.approve(this.chef.address, '1000', { from: alice });
      assert.equal((await this.hawk.balanceOf(alice)).toString(), '0');
      await this.chef.deposit(1, '20', { from: alice });
      
      await this.chef.withdraw(1, '20', { from: alice });
      assert.equal((await this.hawk.balanceOf(alice)).toString(), '263');

      await this.hawk.approve(this.chef.address, '1000', { from: alice });
      await this.chef.enterStaking('20', { from: alice });
      await this.chef.enterStaking('0', { from: alice });
      await this.chef.enterStaking('0', { from: alice });
      await this.chef.enterStaking('0', { from: alice });
      assert.equal((await this.hawk.balanceOf(alice)).toString(), '993');
      // assert.equal((await this.chef.getPoolPoint(0, { from: minter })).toString(), '1900');
    })

    it('real case, single token', async () => {
      this.lp4 = await MockBEP20.new('Tether USD', 'USDT', '1000000', { from: minter });
      this.lp5 = await MockBEP20.new('USD Coin', 'USDC', '1000000', { from: minter });
      this.lp6 = await MockBEP20.new('Chainlink Token', 'LINK', '1000000', { from: minter });

      await this.lp4.transfer(bob, '2000', { from: minter });
      await this.lp5.transfer(bob, '2000', { from: minter });
      await this.lp6.transfer(bob, '2000', { from: minter });

      await this.lp4.transfer(alice, '2000', { from: minter });
      await this.lp5.transfer(alice, '2000', { from: minter });
      await this.lp6.transfer(alice, '2000', { from: minter });
      
      await this.chef.add('2000', this.lp1.address, true, { from: minter });
      await this.chef.add('1000', this.lp2.address, true, { from: minter });
      await this.chef.add('500', this.lp3.address, true, { from: minter });
      await this.chef.add('500', this.lp4.address, true, { from: minter });
      await this.chef.add('500', this.lp5.address, true, { from: minter });
      await this.chef.add('500', this.lp6.address, true, { from: minter });
      assert.equal((await this.chef.poolLength()).toString(), "7");

      console.log((await time.latestBlock()).toString(), 'latest block');
      await time.advanceBlockTo('210');
      await this.lp4.approve(this.chef.address, '1000', { from: alice });
      assert.equal((await this.hawk.balanceOf(alice)).toString(), '0');
      await this.chef.deposit(4, '200', { from: alice });
      
      await this.chef.withdraw(4, '192', { from: alice });
      assert.equal((await this.hawk.balanceOf(alice)).toString(), '72');

      await this.hawk.approve(this.chef.address, '1000', { from: alice });
      await this.chef.enterStaking('20', { from: alice });
      await this.chef.enterStaking('0', { from: alice });
      await this.chef.enterStaking('0', { from: alice });
      await this.chef.enterStaking('0', { from: alice });
      assert.equal((await this.hawk.balanceOf(alice)).toString(), '799');
    })

    it('deposit/withdraw', async () => {
      await this.chef.add('1000', this.lp1.address, true, { from: minter });
      await this.chef.add('1000', this.lp2.address, true, { from: minter });
      await this.chef.add('1000', this.lp3.address, true, { from: minter });

      await this.lp1.approve(this.chef.address, '100', { from: alice });
      await this.chef.deposit(1, '20', { from: alice });
      await this.chef.deposit(1, '0', { from: alice });
      await this.chef.deposit(1, '40', { from: alice });
      await this.chef.deposit(1, '0', { from: alice });
      assert.equal((await this.lp1.balanceOf(alice)).toString(), '1940');
      await this.chef.withdraw(1, '10', { from: alice });
      assert.equal((await this.lp1.balanceOf(alice)).toString(), '1950');
      assert.equal((await this.hawk.balanceOf(alice)).toString(), '999');
      // assert.equal((await this.hawk.balanceOf(dev)).toString(), '100');

      await this.lp1.approve(this.chef.address, '100', { from: bob });
      assert.equal((await this.lp1.balanceOf(bob)).toString(), '2000');
      await this.chef.deposit(1, '50', { from: bob });
      assert.equal((await this.lp1.balanceOf(bob)).toString(), '1950');
      await this.chef.deposit(1, '0', { from: bob });
      assert.equal((await this.hawk.balanceOf(bob)).toString(), '125');
      await this.chef.emergencyWithdraw(1, { from: bob });
      assert.equal((await this.lp1.balanceOf(bob)).toString(), '2000');
    })

    it('staking/unstaking', async () => {
      await this.chef.add('1000', this.lp1.address, true, { from: minter });
      await this.chef.add('1000', this.lp2.address, true, { from: minter });
      await this.chef.add('1000', this.lp3.address, true, { from: minter });

      await this.lp1.approve(this.chef.address, '10', { from: alice });
      await this.chef.deposit(1, '2', { from: alice }); //0
      await this.chef.withdraw(1, '2', { from: alice }); //1

      await this.hawk.approve(this.chef.address, '250', { from: alice });
      await this.chef.enterStaking('240', { from: alice }); //3
      assert.equal((await this.syrup.balanceOf(alice)).toString(), '240');
      assert.equal((await this.hawk.balanceOf(alice)).toString(), '10');
      await this.chef.enterStaking('10', { from: alice }); //4
      assert.equal((await this.syrup.balanceOf(alice)).toString(), '250');
      assert.equal((await this.hawk.balanceOf(alice)).toString(), '249');
      await this.chef.leaveStaking(250);
      assert.equal((await this.syrup.balanceOf(alice)).toString(), '0');
      assert.equal((await this.hawk.balanceOf(alice)).toString(), '749');

    });


    it('update multiplier', async () => {
      await this.chef.add('1000', this.lp1.address, true, { from: minter });
      await this.chef.add('1000', this.lp2.address, true, { from: minter });
      await this.chef.add('1000', this.lp3.address, true, { from: minter });

      await this.lp1.approve(this.chef.address, '100', { from: alice });
      await this.lp1.approve(this.chef.address, '100', { from: bob });
      await this.chef.deposit(1, '100', { from: alice });
      await this.chef.deposit(1, '100', { from: bob });
      await this.chef.deposit(1, '0', { from: alice });
      await this.chef.deposit(1, '0', { from: bob });

      await this.hawk.approve(this.chef.address, '100', { from: alice });
      await this.hawk.approve(this.chef.address, '100', { from: bob });
      await this.chef.enterStaking('50', { from: alice });
      await this.chef.enterStaking('100', { from: bob });

      await this.chef.updateMultiplier('0', { from: minter });

      await this.chef.enterStaking('0', { from: alice });
      await this.chef.enterStaking('0', { from: bob });
      await this.chef.deposit(1, '0', { from: alice });
      await this.chef.deposit(1, '0', { from: bob });

      assert.equal((await this.hawk.balanceOf(alice)).toString(), '700');
      assert.equal((await this.hawk.balanceOf(bob)).toString(), '150');

      await time.advanceBlockTo('305');

      await this.chef.enterStaking('0', { from: alice });
      await this.chef.enterStaking('0', { from: bob });
      await this.chef.deposit(1, '0', { from: alice });
      await this.chef.deposit(1, '0', { from: bob });

      assert.equal((await this.hawk.balanceOf(alice)).toString(), '700');
      assert.equal((await this.hawk.balanceOf(bob)).toString(), '150');

      await this.chef.leaveStaking('50', { from: alice });
      await this.chef.leaveStaking('100', { from: bob });
      await this.chef.withdraw(1, '100', { from: alice });
      await this.chef.withdraw(1, '100', { from: bob });

    });

    it('should allow dev and only dev to update dev', async () => {
        assert.equal((await this.chef.devaddr()).valueOf(), dev);
        await expectRevert(this.chef.dev(bob, { from: bob }), 'dev: wut?');
        await this.chef.dev(bob, { from: dev });
        assert.equal((await this.chef.devaddr()).valueOf(), bob);
        await this.chef.dev(alice, { from: bob });
        assert.equal((await this.chef.devaddr()).valueOf(), alice);
    })
});
