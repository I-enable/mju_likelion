const Sequelize = require('sequelize');

module.exports = class General extends Sequelize.Model{
    static init(sequelize){
        return super.init({
			
            content: {
                type: Sequelize.STRING(50)
            },
            writer: {
                type: Sequelize.INTEGER(50)
            }
		}, {
            sequelize,
            timestamps: false,
            modelName: 'General',
            tableName: 'Generals',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db){
        }
};