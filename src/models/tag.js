import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class tag extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    tag_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    tag_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "tag_name"
    }
  }, {
    sequelize,
    tableName: 'tag',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "tag_id" },
        ]
      },
      {
        name: "tag_name",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "tag_name" },
        ]
      },
    ]
  });
  }
}
