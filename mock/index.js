module.exports = {
    DmShuffleMock: require('./dm-shuffle-mock'),
    DmMock: require('./dm-mock'),
    DmRepo: require('./dm-repo'),
    makeColumnType: function (columnName, patternFunction) {
        return {
            name: columnName,
            patternFunction: patternFunction
        }
    }
}