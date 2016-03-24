describe('fastPool', function () {

    describe('creation', function () {

        it('should throw if no options are passed', function () {
            var hasThrown = false;
            try {
                fastPool();
            } catch (e) {
                hasThrown = true;
            }

            expect(hasThrown).to.equal(true);
        });

        it('should throw if no name is passed', function () {
            var hasThrown = false;
            try {
                var options = {
                    foo: 'bar'
                };
                fastPool(options);
            } catch (e) {
                hasThrown = true;
            }

            expect(hasThrown).to.equal(true);
        });

        it('should throw if neither ctor nor createObject is passed', function () {
            var hasThrown = false;
            try {
                var options = {
                    name: 'test'
                };
                fastPool(options);
            } catch (e) {
                hasThrown = true;
            }

            expect(hasThrown).to.equal(true);
        });

        it('should not throw if name and ctor are passed', function () {
            var hasThrown = false;
            try {
                var options = {
                    name: 'test',
                    ctor: function () {}
                };
                fastPool(options);
            } catch (e) {
                hasThrown = true;
            }

            expect(hasThrown).to.equal(false);
        });

        it('should not throw if name and createObject are passed', function () {
            var hasThrown = false;
            try {
                var options = {
                    name: 'test',
                    createObject: function () {}
                };
                fastPool(options);
            } catch (e) {
                hasThrown = true;
            }

            expect(hasThrown).to.equal(false);
        });

        it('should return existing pool with given name', function () {

            var options = {
                name: 'test_1',
                createObject: '__test_createObject_1__'
            };
            var pool1 = fastPool(options);

            var options2 = {
                name: 'test_1',
                createObject: '__test_createObject_2__'
            };

            var pool2 = fastPool(options2);

            expect(pool1).to.deep.equal(pool2);
        });

    });


    describe('createObject', function () {

        it('should use existing function if given', function () {
            var options = {
                name: '__name_1__',
                createObject: '__createObject__'
            };
            var pool = fastPool(options);

            expect(pool.createObject).to.equal(options.createObject);
        });

        it('should create new function if not given', function () {
            var options = {
                name: '__name_2__',
                ctor: '__ctor__'
            };
            var pool = fastPool(options);

            expect(pool.createObject).to.be.a('function');
        });
    });

});
